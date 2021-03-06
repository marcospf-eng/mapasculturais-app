angular.module('mapasculturais.directives', ['ionic'])

  .directive('filterEvents', ['$localStorage', 'mapas.service.api', '$anchorScroll', '$timeout', 'ConfigState', function($localStorage, mapasApi, $anchorScroll, $timeout, config) {
    return {
      restrict: 'E',
      templateUrl: 'templates/filter-events.html',
      scope: {
        filters: '=',
        onApply: '='
      },
      link: function($scope, el, attrs) {
        var api = mapasApi(config.dataSource.url);
        var original = {
          keyword: '',
          showPast: false,
          from: moment().toDate(),
          to: moment().add(1, 'months').toDate(),
          linguagem: null,
          verified: false
        };

        $scope.filters = angular.extend($scope.filters, original);
        $scope.temp = angular.copy(original);

        function apply() {
          $scope.onApply();
          $scope.close();
        }

        $scope.applyFilters = function() {
          Object.keys($scope.temp).forEach(function(k) {
            $scope.filters[k] = $scope.temp[k];
          });

          apply();
        };

        $scope.cancel = function() {
          $scope.temp = angular.copy($scope.filters);
          $scope.close();
        };

        $scope.reset = function() {
          Object.keys(original).forEach(function(k) {
            $scope.filters[k] = original[k];
          });
          $scope.temp = angular.copy($scope.filters);
          apply();
        };

        $scope.toggle = function() {
          if ($scope.showFilter) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.open = function() {
          $scope.showFilter = true;
          $timeout(function() {
            $anchorScroll('event-filter');
          });
        };

        $scope.close = function() {
          $scope.showFilter = false;
        }

        $scope.findTerm = function(termsArrayFromStorage, termToFind) {
          var found = false;
          for (var x = 0; x < termsArrayFromStorage.length; x++) {
            if (termToFind === termsArrayFromStorage[x].term) {
              found = true;
              break;
            }
          }
          return found;
        }

        api.taxonomyTerms('linguagem').then(function(terms) {
          if ($localStorage.linguagens && $localStorage.linguagens.length > 0) {
            for (var x = 0; x < terms.length; x++) {
              if (!$scope.findTerm($localStorage.linguagens, terms[x])) {
                $localStorage.linguagens.push({
                  "term": terms[x],
                  "checked": false
                });
              }
            }
          } else {
            $localStorage.linguagens = [];
            for (var x = 0; x < terms.length; x++) {
              $localStorage.linguagens.push({
                "term": terms[x],
                "checked": false
              });
            }
          }

        });
      }
    };
  }])

  .directive('filterSpaces', ['mapas.service.api', 'mapas.service.space', '$anchorScroll', '$timeout', 'ConfigState', function(mapasApi, _spaceApi, $anchorScroll, $timeout, config) {
    return {
      restrict: 'E',
      templateUrl: 'templates/filter-spaces.html',
      scope: {
        filters: '=',
        onApply: '='
      },
      link: function($scope, el, attrs) {
        var api = mapasApi(config.dataSource.url);
        var spaceApi = _spaceApi(config.dataSource.url);
        var original = {
          keyword: '',
          area: '',
          type: '',
          verified: false
        };

        $scope.filters = angular.extend($scope.filters, original);
        $scope.temp = angular.copy(original);

        function apply() {
          $scope.onApply();
          $scope.close();
        }

        $scope.applyFilters = function() {
          Object.keys($scope.temp).forEach(function(k) {
            $scope.filters[k] = $scope.temp[k];
          });

          apply();
        };

        $scope.cancel = function() {
          $scope.temp = angular.copy($scope.filters);
          $scope.close();
        };

        $scope.reset = function() {
          Object.keys(original).forEach(function(k) {
            $scope.filters[k] = original[k];
          });
          $scope.temp = angular.copy($scope.filters);
          apply();
        };

        $scope.toggle = function() {
          if ($scope.showFilter) {
            $scope.close();
          } else {
            $scope.open();
          }
        };

        $scope.open = function() {
          $scope.showFilter = true;
          $timeout(function() {
            $anchorScroll('space-filter');
          });
        };

        $scope.close = function() {
          $scope.showFilter = false;
        }

        api.taxonomyTerms('area').then(function(terms) {
          $scope.areas = terms.map(function(e) {
            return {
              id: e,
              name: e
            };
          });

          $scope.areas.unshift({
            id: '',
            name: 'Todas'
          });
        });

        spaceApi.getTypes().then(function(types) {
          $scope.types = types.sort(function(a, b) {
            if (a.name > b.name) {
              return 1;
            } else if (a.name < b.name) {
              return -1;
            } else {
              return 0;
            }
          });
          $scope.types.unshift({
            id: '',
            name: 'Todos'
          });
        });
      }
    };
  }]);
