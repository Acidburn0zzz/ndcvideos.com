angular.module('ndc')
    .run(function (Config, $httpBackend, $log, APIBaseUrl, regexEscape, guid) {
        if(!Config.API.useMocks) return;

        var collectionUrl = APIBaseUrl + 'videos';
        var IdRegExp = /[\d\w-_]+$/.toString().slice(1, -1);

        console.log('Stubbing video API - ' + collectionUrl);
        console.log('************');

        var VideoRepo = {};
        VideoRepo.data = [
            {
                id: 1,
                title: 'In The Open: Ellie Goulding - Guns And Horses',
                description: 'Having listened to Ellie Gouldings debut album, Lights, I was always curious as to how it would translate acoustically since most of the album is more electronic driven. After a long drive from Portland, Oregon Ellie made it to San Francisco with just enough time to meet up.',
                duration: 1234,
                videoId: 86603468,
                type:'vimeo',
                tags:[{
                        title: 'music'
                    },
                    {
                        title: 'guns'
                    }
                ],
                upload_date: "2014-02-13 08:04:18",
                thumbnail_small: "http://b.vimeocdn.com/ts/464/338/464338254_100.jpg",
                thumbnail_medium: "http://b.vimeocdn.com/ts/464/338/464338254_200.jpg",
                thumbnail_large: "http://b.vimeocdn.com/ts/464/338/464338254_640.jpg",
            },

            {
                id: 2,
                title: 'Elom Musk - SpaceX',
                description: 'Elom musk er helt tullete. Her viser han skillz.',
                duration: 12324,
                videoId: "86396740",
                type:'youtube',
                tags:[
                    {
                        title:'space'
                    },
                    {
                        title:'space exploration'
                    }
                ],
                upload_date: "2014-02-11 04:25:00",
                thumbnail_small: "http://b.vimeocdn.com/ts/464/052/464052168_100.jpg",
                thumbnail_medium: "http://b.vimeocdn.com/ts/464/052/464052168_200.jpg",
                thumbnail_large: "http://b.vimeocdn.com/ts/464/052/464052168_640.jpg",
            },

            {
                id: 3,
                title: 'Visitor pattern in Ruby',
                description: 'Explaining the Visitor pattern in  Ruby',
                duration: 123224,
                videoId: 85096027,
                type:'vimeo',
                tags:[{
                    title:'guns'
                }]
            },

            {
                id: 4,
                title: 'Ruby 2.0',
                description: 'First look at prepending a module.',
                duration: 121324,
                videoId: 60572321,
                type:'vimeo'}
        ];
        VideoRepo.index = {};


        angular.forEach(VideoRepo.data, function(item, key) {
            VideoRepo.index[item.id] = item;
        });


        //GET video/
        $httpBackend.whenGET(collectionUrl).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to video', data);
            return [200, VideoRepo.data, {/*headers*/}];
        });

        //POST video/
        $httpBackend.whenPOST(collectionUrl).respond(function(method, url, data, headers) {
            $log.log('Intercepted POST to video', data);
            var Video = angular.fromJson(data);

            Video.id = guid();
            VideoRepo.data.push(Video);
            VideoRepo.index[Video.id] = Video;

            return [200, Video, {/*headers*/}];
        });

        //GET video/id
        $httpBackend.whenGET( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted GET to video');
            var id = url.match( new RegExp(IdRegExp) )[0];
            return [VideoRepo.index[id]?200:404, VideoRepo.index[id] || null, {/*headers*/}];
        });

        //PUT video/id
        $httpBackend.whenPUT( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted PUT to video');
            var id = url.match( new RegExp(IdRegExp) )[0];

            if (!VideoRepo.index[id]) {
                return [404, {} , {/*headers*/}];
            }

            var Video = VideoRepo.index[id] = angular.fromJson(data);

            return [200, Video, {/*headers*/}];
        });

        //DELETE video/id
        $httpBackend.whenDELETE( new RegExp(regexEscape(collectionUrl + '/') + IdRegExp ) ).respond(function(method, url, data, headers) {
            $log.log('Intercepted DELETE to video');
            var id = url.match( new RegExp(IdRegExp) )[0];

            var Video = VideoRepo.index[id];
            if (!Video) {
                return [404, {} , {/*headers*/}];
            }
            delete VideoRepo.index[Video.id];
            var index = VideoRepo.data.indexOf(Video);
            VideoRepo.data.splice(index, 1);
            return [200, Video , {/*headers*/}];
        });

    });


