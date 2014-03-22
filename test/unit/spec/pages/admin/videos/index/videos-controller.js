'use strict';

describe('Controller(/admin/videos): AdminVideosCtrl', function () {

    var Videos, scope, VideoRepository, vimeoAPI, deferred, promise, $rootScope;

    beforeEach(function () {

        function getPromise() {
            return promise;
        }

        VideoRepository = {
            getAll: jasmine.createSpy('VideoRepository.getAll').andCallFake(getPromise)
        };

        vimeoAPI = {
            getVideos: jasmine.createSpy('vimeoAPI.getVideos').andCallFake(getPromise)
        };

        module('ndc');

        inject(function ($controller, _$rootScope_, $q) {
            deferred = $q.defer();
            promise = deferred.promise;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            Videos = $controller('AdminVideosCtrl', {
                $scope: scope,
                VideoRepository: VideoRepository,
                vimeoAPI: vimeoAPI
            });
        });
    });

    it('should list existing videos', function() {
        deferred.resolve([1,2,3,4,5]);
        $rootScope.$digest();
        expect(scope.existingVideos.length).toBe(5);
    });

    it('should list videos from vimeo', function () {

        deferred.resolve([1,2,3,4,5]);
        $rootScope.$digest();
        expect(scope.vimeoVideos.length).toBe(5);

    });
});