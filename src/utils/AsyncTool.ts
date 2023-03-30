import { isUndefined } from './TypeTools/TypesTools';

interface APIOption<R, ER,> {
    success?: (r: R) => void
    fail?: (r: ER) => void
}

/**
 * 异常捕获方法
 * @param {Promise} promise
 * @returns
 */
export async function to<T,>(promise: Promise<T>): Promise<[Error | any, T | null]> {
    try {
        const res = await promise as T;
        return [null, res];
    } catch (error) {
        return [error, null];
    }
}

/**
 * node大哥提供的优秀promise转化方案
 * @param api
 */
export function promisify<P extends object, R, ER,>(api: (option?: P & APIOption<R, ER>) => any) {
    return (options?: Omit<P, 'success' | 'fail'>) => {
        return new Promise<R>((resolve, reject) => {
            // @ts-ignore
            api({
                ...options,
                success: resolve,
                fail: reject,
            });
        });
    };
}

/**
 * 异步循环call
 * */
export function cycleCallAsync<P extends any[], R,>(count: number, method: (...args: P) => Promise<R>) {
    return async function (...args: P) {
        let counter = 0;
        do {
            const [err, res] = await to(method(...args));
            if (err) {
                if (++counter >= count)
                    throw err;
            } else {
                return res as R;
            }
        } while (true);
    };
}

/**
 * 缓存异步结果
 * @param api
 * @returns
 */
export function cacheResultAsync<P extends any[], R,>(api: (...args: P) => Promise<R>) {
    let result: R | undefined; // 将undefined视为无缓存结果
    const taskList: Promise<any>[] = [];

    async function task(...args: P): Promise<R> {
        if (!isUndefined(result))
            return result;

        if (taskList.length > 0) {
            await Promise.all(taskList);
            taskList.splice(0);
            return (result ?? null)!;
        }

        taskList.push(api(...args).then(res => result = res));

        return await task(...args);
    }
    /**
     * 不调用缓存结果
     */
    task.AsNoCache = api;

    /**
     * 清除缓存
     */
    task.clear = () => result = undefined;

    return task;
}
