/* global jasmine */

const dialog = {
    cancel: jasmine.createSpy('cancel'),
    hide: jasmine.createSpy('hide'),
    show: jasmine.createSpy('show').and.callFake((config) => {
        if (config.onComplete) {
            config.onComplete();
        }
    })
};

const $state = {
    params: {},
    go: jasmine.createSpy('stateGo')
};

const $scope = (controller) =>  {
    return {
        $watchGroup: jasmine.createSpy('watchGroup').and.callFake((toCallArray, action) => {
            toCallArray = toCallArray.map(call => {
                return call();
            });
            action(toCallArray);
        }),
        $watchCollection: jasmine.createSpy('$watchCollection').and.callFake((toCall, action) => action(toCall({
            vm: controller
        }))),
        $watch: jasmine.createSpy('$watch').and.callFake((toCall, action) => action(toCall({
            vm: controller
        }))),
        $evalAsync: jasmine.createSpy('evalAsync').and.callFake(toCall => {
            if (toCall) {
                toCall();
            }
        })
    };
};

const toast = {};

toast.show = jasmine.createSpy('showToast').and.returnValue(toast);
toast.simple = jasmine.createSpy('simple').and.returnValue(toast);
toast.parent = jasmine.createSpy('parent').and.returnValue(toast);
toast.position = jasmine.createSpy('position').and.returnValue(toast);
toast.textContent = jasmine.createSpy('textContent').and.returnValue(toast);
toast.hideDelay = jasmine.createSpy('hideDelay').and.returnValue(toast);


const $timeout = toCall => {
    return toCall();
};

const $interpolate = jasmine.createSpy('interpolate').and.returnValue(() => {});
const $anchorScroll = jasmine.createSpy('$anchorScroll').and.callFake(a => a);

export {
    dialog,
    $state,
    $scope,
    $interpolate,
    $anchorScroll,
    toast,
    $timeout
};
