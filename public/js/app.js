// NOTE: Need to change to fix html

angular.module('nodetrack', [])
.controller('mainController', ($scope, $http) => {
  $scope.formData = {};
  $scope.trackData = {};
  // Get all tracks
  $http.get('/api/v1/tracks')
  .success((data) => {
    $scope.trackData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
  // Create a new track
  $scope.createtrack = () => {
    $http.post('/api/v1/tracks', $scope.formData)
    .success((data) => {
      $scope.formData = {};
      $scope.trackData = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };
  // Delete a track
  $scope.deletetrack = (trackID) => {
    $http.delete('/api/v1/tracks/' + trackID)
    .success((data) => {
      $scope.trackData = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };
  // Create a new track
  $scope.login = () => {

  };
});
