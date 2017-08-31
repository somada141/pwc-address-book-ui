'use strict';

/**
 * @ngdoc function
 * @name pwcui.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pwcui
 */
angular.module('pwcui')
  .controller('MainCtrl', function ($scope, $http, FileUploader, Notification) {

    // Initialize empty arrays to hold the contacts.
    // Array to hold contacts currently in the DB.
    $scope.contacts = [];
    // Array to hold contact candidates.
    $scope.contacts_candidates = [];

    $scope.refresh_contacts = function() {
      $http({url: 'http://127.0.0.1:8000/contacts/get', method: 'POST'}).then(function (response) {
        angular.copy(response.data, $scope.contacts);
      });
    };

    $scope.add_contacts = function() {

      var contacts_to_add = {
        contacts: $scope.contacts_candidates
      };

      $http({
        url: 'http://127.0.0.1:8000/contacts/add',
        method: 'POST',
        data: angular.toJson(contacts_to_add)
      }).then(function (response) {
        console.log(response);

        for (var i = 0; i < response.data.contacts.accepted.length; i++) {
          var contact_accepted = response.data.contacts.accepted[i];
          var contact_accepted_dets = contact_accepted.name + ' (' + contact_accepted.email + ')';
          Notification.success({title: 'Accepted', message: contact_accepted_dets});
          $scope.reject_candidate(contact_accepted.email);
        }
        for (var j = 0; j < response.data.contacts.rejected.length; j++) {
          var contact_rejected = response.data.contacts.rejected[j];
          var contact_rejected_dets = contact_rejected.name + " (" + contact_rejected.email + ")";
          Notification.warning({title: 'Rejected', message: contact_rejected_dets});
        }
        $scope.refresh_contacts();
        // console.log(response.data);
      });
    };

    // Reject a given candidate contact from the candidate pool through its email address.
    $scope.reject_candidate = function (contact_candidate_email) {
      var contact_candidates_new = [];
      for (var i = 0; i < $scope.contacts_candidates.length; i++) {
        var contact_candidate = $scope.contacts_candidates[i];
        if (contact_candidate.email !== contact_candidate_email) {
          contact_candidates_new.push(contact_candidate);
        } else {
          var contact_candidate_dets = contact_candidate.name + " (" + contact_candidate.email + ")";
          Notification.info({title: 'Dropped', message: contact_candidate_dets});
        }
      }
      $scope.contacts_candidates = contact_candidates_new;
    };

    // Accept a given candidate contact and push it to the DB through its email address.
    $scope.accept_candidate = function (contact_candidate_email) {
      var contact_candidates_new = [];
      for (var i = 0; i < $scope.contacts_candidates.length; i++) {
        var contact_candidate = $scope.contacts_candidates[i];
        if (contact_candidate.email !== contact_candidate_email) {
          contact_candidates_new.push(contact_candidate);
        } else {
          $http({
            url: 'http://127.0.0.1:8000/contacts/update',
            method: 'POST',
            data: angular.toJson({contacts:[contact_candidate]})
          }).then(function (response) {
            console.log(response);
            var contact_candidate_dets = contact_candidate.name + " (" + contact_candidate.email + ")";
            Notification.success({title: 'Updated', message: contact_candidate_dets})
            $scope.refresh_contacts();
          });
        }
      }
      $scope.contacts_candidates = contact_candidates_new;

    };



    var uploader = $scope.uploader = new FileUploader({
      url: 'http://127.0.0.1:8000/upload'
    });

    // FILTERS

    // a sync filter
    uploader.filters.push({
      name: 'syncFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        console.log('syncFilter');
        return this.queue.length < 10;
      }
    });

    // an async filter
    uploader.filters.push({
      name: 'asyncFilter',
      fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
        console.log('asyncFilter');
        setTimeout(deferred.resolve, 1e3);
      }
    });

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      angular.copy(response, $scope.contacts_candidates);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      Notification.error({title: 'Error', message: response.description, delay: 20000});
    };

    // Force contact update by fetching them through the API.
    $scope.refresh_contacts();

  });
