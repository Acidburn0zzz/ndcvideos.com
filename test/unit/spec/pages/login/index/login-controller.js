'use strict';

describe('Controller(/login): LoginCtrl', function () {

    var LoginCtrl, scope, authentication, $q, promise, $state, isLoggedIn = true;

    beforeEach(function () {

        authentication = {
            login: jasmine.createSpy('authentication.login').andReturn(promise),
            isLoggedIn: jasmine.createSpy('authentication.isLoggedIn').andReturn(isLoggedIn)
        };

        $state = {
            go: jasmine.createSpy('$state.go')
        };

        module('ndc', function ($provide) {
            $provide.value('authentication', authentication);
        });

        inject(function ($controller, $rootScope, _$q_) {
            scope = $rootScope.$new();
            $q = _$q_;
            LoginCtrl = $controller('LoginCtrl', {
                $scope: scope,
                init: 'DATA',
                $state: $state
            });

            promise = $q.all([]);

        });
    });

    it('should redirect if the user is already logged in', function() {
        expect($state.go).toHaveBeenCalled();
    });

    it('should attach init data to scope', function () {
        expect(scope.data).toEqual('DATA');
    });

    it('should trigger a login', function() {
        scope.login('user', 'pw');
        expect(authentication.login).toHaveBeenCalledWith('password', 'user', 'pw');
    });
});

describe('Service(/login): LoginCtrlInit', function () {

    var LoginCtrlInit;

    beforeEach(function () {

        module('ndc');

        inject(function (_LoginCtrlInit_) {
            LoginCtrlInit = _LoginCtrlInit_;
        });

    });

    it('should have a prepare function', function () {
        expect(typeof LoginCtrlInit.prepare).toEqual('function');
    });

    it('should return a promise', function () {
        expect(typeof LoginCtrlInit.prepare().then).toEqual('function');
    });

});