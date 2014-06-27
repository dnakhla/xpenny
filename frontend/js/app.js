(function () {
    'use strict';
    var xPenny = angular.module('xpenny', ['ngCookies', 'ngResource']);
    var expenseController = function ($scope, $cookieStore, Expense, User) {
        $scope.loading = false;
        $scope.user = User.user;
        $scope.user.loggedin = User.user.access == false ? false : true;
        $scope.error = {
            value: false,
            message: ''
        };
        $scope.expenses = {};
        $scope.activecard = $scope.user.loggedin == true ? 'home' : 'signup';
        $scope.resetError = function () {
            $scope.error = {
                value: false,
                message: ''
            };
        };
        $scope.activatecard = function (card) {
            $scope.activecard = card;
        };
        $scope.loginUser = function () {
            $scope.loading = true;
            $scope.error.value = false;
            User.login($scope.user)
                .success(function (data) {
                    console.log(data);
                    var access_token = btoa($scope.user.email + ":" + $scope.user.password);
                    $scope.user.access = access_token;
                    $cookieStore.put('access', access_token);
                    $scope.activecard = 'home';
                    $scope.user.loggedin = true;
                })
                .error(function (data) {
                    $scope.error = {
                        value: data.error,
                        message: data.message
                    };
                }).finally(function () {
                    $scope.loading = false;
                });
        };
        $scope.signupUser = function () {
            $scope.loading = true;
            $scope.error.value = false;
            User.signup($scope.user)
                .success(function (data) {
                    console.log(data);
                    var access_token = btoa($scope.user.email + ":" + $scope.user.password);
                    $scope.user.access = access_token;
                    $cookieStore.put('access', access_token);
                    $scope.activecard = 'home';
                    $scope.user.loggedin = true;
                })
                .error(function (data) {
                    $scope.error = {
                        value: data.error,
                        message: data.message
                    };
                }).finally(function () {
                    $scope.loading = false;
                });
        };
        $scope.logoutUser = function () {
            $scope.user.access = false;
            $scope.user.loggedin = false;
            $scope.activecard = 'login';
            User.logout();
        };
        $scope.submitExpense = function () {
            $scope.loading = true;
            // save the expense. pass in expense data from the form
            // use the function we created in our service
            Expense.save($scope.expenseData)
                .success(function (data) {
                    // if successful, we'll need to refresh the expense list
                    Expense.get()
                        .success(function (getData) {
                            $scope.expenses = getData;
                            $scope.loading = false;
                        });

                })
                .error(function (data) {
                    console.log('er', data);
                });
        };

    };

    var userModel = function ($http, $cookieStore) {
        return {
            user: {
                email: 'dnakhla@gmail.com',
                password: 'test',
                name: 'Nina Turk',
                access: $cookieStore.get('access') || false
            },
            logout: function () {
                return $cookieStore.remove('access');
            },
            login: function (userData) {
                return $http({
                    method: 'POST',
                    url: '/backend/public/api/user/login',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: userData
                });
            },
            signup: function (userData) {
                return $http({
                    method: 'POST',
                    url: '/backend/public/api/user/signup',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: userData
                });
            }
        };

    };
    var expenseModel = function ($http) {
        return {
            // get all the expenses
            get: function () {
                return $http.get('backend/api/expense');
            },
            // save a expense (pass in expense data)
            save: function (expenseData) {
                return $http({
                    method: 'POST',
                    url: 'backend/api/expense',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: expenseData
                });
            },
            // destroy a expense
            destroy: function (id) {
                return $http.delete('backend/api/expense/' + id);
            }
        };
    };
    xPenny.controller('ExpenseCtrl', expenseController);
    xPenny.factory('Expense', expenseModel);
    xPenny.factory('User', userModel);
}).call(this);