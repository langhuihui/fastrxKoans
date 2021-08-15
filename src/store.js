import { streams, composable, querying, time, events, advanced, mapping, imperative } from './lessons';
import getQ from './questions'
import { watchEffect, reactive } from 'vue'
import rx from 'fastrx/dist/index'

export default {
    state() {
        const lessons = { streams, composable, querying, time, events, advanced, mapping, imperative }
        const rules = reactive({});
        const formData = reactive({});
        for (let k in lessons) {
            lessons[k] = lessons[k].map((lesson) => {
                const q = getQ(lesson);
                if (q.length > 1) {
                    formData[q.name] = [];
                    const ob = rx.subject();
                    watchEffect(() => {
                        const ret = [];
                        for (let i = 1; i <= q.length; i++) {
                            ret.push(formData[q.name + i]);
                        }
                        ob.next(ret);
                    });
                    ob.debounceTime(2000).subscribe((x) => (formData[q.name] = x));
                }
                const sub = rx.subject();

                let resolve, reject;
                let promise
                const storeCallback = () => promise = new Promise((__resolve, __reject) => (resolve = __resolve, reject = __reject));
                storeCallback()
                sub.debounceTime(500).subscribe((value) => {
                    q.validate(value, resolve, reject);
                    storeCallback()
                });
                rules[q.name] = [
                    {
                        required: true, async validator(rule, value) {
                            sub.next(value);
                            return promise;
                        },
                    },
                ];
                return q;
            });
        }
        return {
            lessons,
            rules,
            formData,
        }
    }
}