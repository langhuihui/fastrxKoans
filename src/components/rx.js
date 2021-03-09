const noop = Function.prototype
const defaultThrottleConfig = { leading: true, trailing: false }
export const fromPromise = ({ arg }) => (n, c) => {
    arg.then(d => (c && n(d), c && c())).catch(e => c && c(e))
    return () => c = null
}
export const of = ({ arg }) => (n, c) => {
    arg = arg.split(',')
    let i = 0
    setTimeout(() => {
        while (i >= 0 && i < arg.length) {
            n(arg[i++])
        }
        if (i >= 0) c()
    })
    return () => i = -1
}
export const fromEvent = ({ arg }) => (n, c, s) => {
    let [target, name] = arg.split(",");
    target = eval(target);
    name = eval(name);
    target.addEventListener(name, n);
    return () => target.removeEventListener(name, n);
}

export const interval = ({ arg }) => (n, c, s) => {
    let i = s.label = 0;
    let clearId = setInterval(() => {
        n(i++);
    }, arg);
    return () => clearInterval(clearId);
}

export const takeWhile = ({ arg: f, source }) => (n, c, s) => {
    const dispose = source.subscribe((data) => {
        if (!f(data.data)) {
            dispose()
            c()
            return
        }
        n(data);
    }, c);
    return dispose
}

export const map = ({ arg: f, source }) => (n, c, s) => source.subscribe((data) => {
    data.data = f(data.data);
    n(data);
}, c)
export const filter = ({ arg: f, source }) => (n, c, s) => source.subscribe((data) => f(data.data) && n(data), c)

export const take = ({ arg, source }) => (n, c, s) => {
    let remain = arg
    s.label = remain
    const dispose = source.subscribe((data) => {
        n(data);
        if (--remain == 0) {
            c();
            dispose();
        }
        s.label = remain
    }, c);
    return dispose;
};

export const takeUntil = ({ source }, sources) => ((n, c, s) => {
    const [sSrc] = sources
    const ssd = sSrc.subscribe(d => (sd(), ssd(), c()), noop)
    const sd = source.subscribe(n, err => (ssd(), c(err)))
    return () => (ssd(), sd())
})

export const skip = ({ arg, source }) => (n, c, s) => {
    let _count = s.label = arg;
    let _n = () => ((s.label = --_count) === 0 && (_n = n));
    return source.subscribe(d => _n(d), c)
}

export const skipWhile = ({ arg: f, source }) => (n, c, s) => {
    let _n = d => (f(d.data) || (_n = n, n(d)));
    return source.subscribe(d => _n(d), c)
}
export const skipUntil = ({ source }, sources) => ((n, c, s) => {
    const [sSrc] = sources
    let _n = noop
    const ssd = sSrc.subscribe(d => ((_n = n), ssd()), noop)
    const sd = source.subscribe(d => _n(d), err => (ssd(), c(err)))
    return () => (ssd(), sd())
})
export const merge = (_, sources) => ((n, c, s) => {
    let nLife = sources.length
    const complete = err => {
        if (--nLife == 0) {
            dispose()
            c(err)
        }
    }
    let disposes = sources.map(source => source.subscribe(n, complete))
    const dispose = () => disposes.forEach(d => d())
    return dispose
})
export const race = (ctx, sources) => ((n, c, s) => {
    const close = (j) => defers.forEach((defer, i) => i !== j && defer())
    let nLife = sources.length;
    let _n = (d, i) => {
        n(d)
        close(i)
        _n = n
        _c = c
    }
    let _c = err => --nLife === 0 && c(err);
    const defers = sources.map((source, i) => source.subscribe(d => _n(d, i), err => _c(err)))
    return close
})
export const concat = (_, sources) => ((n, c, s, pos = 0, sdefer = noop, l = sources.length, f = err => err ? c(err) : pos < l ? sdefer = sources[pos++].subscribe(n, f) : c()) => (f(), () => (pos = l, sdefer())))
export const combineLatest = (_, sources) => ((n, c) => {
    const nTotal = sources.length
    let nLife = nTotal
    let nRun = 0;
    let _c = err => (--nLife) === 0 && c(err);
    const array = new Array(nTotal)
    const _n = i => {
        const $n = d => {
            array[i] = d.data;
            if (nRun === nTotal) { //所有源都激活了，可以组织推送数据了，切换到第三状态
                n(array);
                __n = d => (array[i] = d.data, n(array));
            }
        }
        let __n = d => (++nRun, __n = $n, __n(d)); //第一次数据达到后激活,切换到第二状态
        return d => __n(d)
    }
    const defers = sources.map((source, i) => source.subscribe(_n(i), _c))
    return () => defers.forEach(defer => defer())
})
export const switchMapTo = ({ source }, sources) => ((n, c, s) => {
    let currDisposable = null,
        sourceEnded = false,
        dispose = noop
    dispose = source.subscribe(d =>
        currDisposable = (currDisposable && currDisposable(),
            sources[0].subscribe(n,
                err => {
                    currDisposable = null;
                    if (sourceEnded) c(err)
                })),
        err => {
            sourceEnded = true
            if (!currDisposable) c(err);
        }
    )
    return () => {
        dispose()
        currDisposable = (currDisposable && currDisposable(), null)
    }
})
export const share = ctx => {
    let sourceDefer = noop;
    const ns = []
    const nc = []
    const next = d => ns.forEach(n => n(d))
    const complete = e => {
        nc.forEach(c => c(e))
        ns.length = nc.length = 0
        sourceDefer = noop
    }
    return (n, c, s) => {
        ns.push(n)
        nc.push(c)
        if (sourceDefer === noop) sourceDefer = ctx.source.subscribe(next, complete)
        return () => {
            ns.splice(ns.indexOf(n), 1)
            nc.splice(nc.indexOf(c), 1)
            if (nc.length === 0) sourceDefer = (sourceDefer(), noop);
        }
    }
}
export const startWith = ({ arg: data, source }) => (n, c, s) => {
    n({ data })
    return source.subscribe(n, c)
}
export const throwError = ({ arg }) => (n, c) => {
    c(new Error(arg))
}
export const throttleTime = ({ arg, source }) => (n, c) => {
    const config = defaultThrottleConfig
    let _throttled = false;
    let _defer = noop
    let last = null
    let hasValue = false;

    function send(d) {
        if (hasValue) {
            n(d)
            throttle(d)
        }
        hasValue = false
    }

    function throttleDone() {
        if (_throttled) _defer()
        _throttled = false
        if (config.trailing) {
            send(last)
        }
    }
    function check() {
        let id = setTimeout(throttleDone, arg)
        return () => clearTimeout(id)
    }
    const throttle = d => (_throttled = true, _defer = check())
    const defer = source.subscribe(d => {
        last = d
        hasValue = true
        if (!_throttled) {
            if (config.leading) send(d)
            else throttle(d)
        }
    }, err => err ? c(err) : (throttleDone(), c()))
    return () => (_defer(), defer())
}
export const debounceTime = ({ arg, source }) => (n, c) => {
    let buffer = null
    let timeId = null
    return source.subscribe(data => {
        buffer = data
        if (timeId) {
            clearTimeout(timeId)
        }
        timeId = setTimeout(() => {
            n(data)
            timeId = null
        }, arg)
    }, err => {
        if (timeId) {
            clearTimeout(timeId)
            if (!err && buffer) {
                n(buffer)
            }
        }
        c(error)
    })
}
export const subscribe = ctx => (ctx.clickTag = (s) => s.dispose(), (n, c, s) => ctx.source.subscribe(
    n,
    (err) => {
        s.label = err || "Complete";
        c(err);
    }
))