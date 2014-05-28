'use strict';

angular.module('ndc')
  .config(function ($stateProvider, stateFactory) {
    $stateProvider.state('administrateUsers', stateFactory('Administrateusers', {
      url: '/users',
      templateUrl: 'states/admin/administrate-users/index/main-view.html',
      parent: 'admin'
    }));
  })
  .controller('AdministrateusersCtrl', function ($scope, UserRepository, Paginator) {

    $scope.paginatedUsers = new Paginator({pageSize: 10});

    $scope.confirm = function (message) {
      return confirm(message) == true;
    };

    $scope.promise = UserRepository.getAll().then(function (users) {
      $scope.paginatedUsers.setData(users);
    });

    $scope.createUser = function () {
      $scope.isCreatingNewUser = true;
    };

    $scope.resetNewUser = function () {
      $scope.isCreatingNewUser = false;
      $scope.newUser = {};
    };

    $scope.resetPassword = function (user) {
      if ($scope.confirm('Are you sure you want to reset password for user ' + user.username + '?')) {

        user.$resetPassword(user.username)
          .then(function(){
            //TODO: Give some notification of great success
            alert('Reset password for user ' + user.username + '.');
          })
          .catch(function(err){
            $log.log(err);
            alert('Could not reset password for user ' + user.username + '.');
          });
      }

    };

    $scope.deleteUser = function (user) {
      var index = $scope.paginatedUsers.data.indexOf(user);
      var userBackup = $scope.paginatedUsers.data.splice(index, 1);

      if ($scope.confirm('Are you sure you want to delete the user ' + user.username + '?')) {
        user.$delete()
          .then(function () {
            //TODO: Give some notification of great success
            //alert('Brukeren ble slettet');
          })
          .catch(function () {
            //If deletaion fails, insert the user again
            //TODO: Expose a reference from the repository and let the repository handle the removal
            $scope.paginatedUsers.data.splice(index, 0, userBackup);
          })
      }
    };

    $scope.saveUser = function (user) {
      $scope.isCreatingNewUser = false;

      var User = UserRepository.create(user);
      $scope.paginatedUsers.data.push(user);

      User.$save()
        .then(function (user) {
          $scope.newUser = {};
        })
        .catch(function () {
          $scope.isCreatingNewUser = true;
          $scope.paginatedUsers.data.splice($scope.paginatedUsers.data.indexOf(User), 1);
          //TODO: More user friendly feedback
          alert('User already exists');
        });

    };
  });
