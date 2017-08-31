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

    // Fetches all contacts from the database via the POST API.
    $scope.refresh_contacts = function() {
      $http({url: 'http://127.0.0.1:8000/contacts/get', method: 'POST'}).then(function (response) {
        // Copy the retrieved contacts into the `$scope`.
        angular.copy(response.data, $scope.contacts);
      });
    };

    // Adds all `contacts_candidates` to the DB via the API and reports on accepted/rejected contacts.
    $scope.add_contacts = function() {
      // Form an object containing the contacts to be added adhering to the API schema.
      var contacts_to_add = {
        contacts: $scope.contacts_candidates
      };

      // Perform the POST request.
      $http({
        url: 'http://127.0.0.1:8000/contacts/add',
        method: 'POST',
        data: angular.toJson(contacts_to_add)
      }).then(function (response) {
        console.log(response);

        // Iterate over the accepted contacts and post a notification.
        for (var i = 0; i < response.data.contacts.accepted.length; i++) {
          var contact_accepted = response.data.contacts.accepted[i];
          var contact_accepted_dets = contact_accepted.name + ' (' + contact_accepted.email + ')';
          Notification.success({title: 'Accepted', message: contact_accepted_dets, delay: 10000});
          $scope.reject_candidate(contact_accepted.email);
        }

        // Iterate over the rejected contacts and post a notification.
        for (var j = 0; j < response.data.contacts.rejected.length; j++) {
          var contact_rejected = response.data.contacts.rejected[j];
          var contact_rejected_dets = contact_rejected.name + " (" + contact_rejected.email + ")";
          Notification.warning({title: 'Rejected', message: contact_rejected_dets, delay: 10000});
        }

        // Re-fetch the contacts from the DB to update the listing.
        $scope.refresh_contacts();
      });
    };

    // Reject a given candidate contact from the candidate pool through its email address.
    $scope.reject_candidate = function (contact_candidate_email) {
      // Initialize a new array to hold the remaining candidates following the rejection of one.
      var contact_candidates_new = [];

      // Iterate over the contact candidates and keep all but the one that was rejected.
      for (var i = 0; i < $scope.contacts_candidates.length; i++) {
        var contact_candidate = $scope.contacts_candidates[i];
        if (contact_candidate.email !== contact_candidate_email) {
          contact_candidates_new.push(contact_candidate);
        // Post a notification for the rejected contact.
        } else {
          var contact_candidate_dets = contact_candidate.name + " (" + contact_candidate.email + ")";
          Notification.info({title: 'Dropped', message: contact_candidate_dets, delay: 10000});
        }
      }

      // Set the new candidates into the scope.
      $scope.contacts_candidates = contact_candidates_new;
    };

    // Accept a given candidate contact and push it to the DB through its email address.
    $scope.accept_candidate = function (contact_candidate_email) {
      // Initialize a new array to hold the remaining candidates following the rejection of one.
      var contact_candidates_new = [];

      // Iterate over the contact candidates and keep all but the one that was accepted.
      for (var i = 0; i < $scope.contacts_candidates.length; i++) {
        var contact_candidate = $scope.contacts_candidates[i];
        if (contact_candidate.email !== contact_candidate_email) {
          contact_candidates_new.push(contact_candidate);
        // Update the accepted contact via the API.
        } else {
          $http({
            url: 'http://127.0.0.1:8000/contacts/update',
            method: 'POST',
            data: angular.toJson({contacts:[contact_candidate]})
          // Post a notification for the accepted contact.
          }).then(function (response) {
            console.log(response);
            var contact_candidate_dets = contact_candidate.name + " (" + contact_candidate.email + ")";
            Notification.success({title: 'Updated', message: contact_candidate_dets, delay: 10000});
            $scope.refresh_contacts();
          });
        }
      }
      // Set the new candidates into the scope.
      $scope.contacts_candidates = contact_candidates_new;
    };

    // File uploader object as required by the `angular-file-upload` component.
    var uploader = $scope.uploader = new FileUploader({
      url: 'http://127.0.0.1:8000/upload',
      removeAfterUpload: true
    });

    // File-upload callback for successful upload. When a CSV has been uploaded and processed by the API backend the
    // contacts within are returned in the JSON response.
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      // Copy the returned contacts under the `contacts_candidates` array.
      angular.copy(response, $scope.contacts_candidates);
    };

    // File-upload callback for successful upload. Should a failure occur when processing the uploaded CSV via the API
    // post a notification with the exception information.
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      Notification.error({title: 'Error', message: response.description, delay: 20000});
    };

    // Force contact update by fetching them through the API.
    $scope.refresh_contacts();
  });
