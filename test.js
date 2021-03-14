const rxProxy = new Proxy(() => {

}, {
    apply(target, _this, args) {
        console.log(target, _this, args)
    }
})
rxProxy('abc')