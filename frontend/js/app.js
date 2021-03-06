var xPenny = angular.module('xpenny', ['ngCookies']);
xPenny.controller('ExpenseCtrl', ['$scope', '$cookieStore', '$http', '$filter', 'Expense', 'User', expenseController]);
xPenny.factory('Expense', ['$http', expenseModel]);
xPenny.factory('User', ['$http', '$cookieStore', userModel]);
xPenny.filter('timeago', timeagoFilter);