;
(function() {
    var filters = angular.module('filters', []);
    filters.filter('html', ['$sce',function($sce) {
        return function(input) {
            return $sce.trustAsHtml(input);
        }
    }]);
    filters.filter('toNum', [function() {
        return function(input) {
            return (input+'000')*1;
        }
    }]);
})();
