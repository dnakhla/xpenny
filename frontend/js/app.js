(function () {
    'use strict';
    var xPenny = angular.module('xpenny', ['ngCookies']);
    var expenseController = function ($scope, $cookieStore, $http, Expense, User) {
        $scope.loading = false;
        $scope.user = User.getUser();
        $scope.error = {
            value: false,
            message: ''
        };
        $scope.success = {
            value: false,
            message: ''
        };
        $scope.showAddExpense = false;
        $scope.expenses = false;




        $scope.renewActiveExpense = function () {
            $scope.activeExpense = {
                amount: null,
                description: '',
                comment: '',
                date: new Date()

            };
        }
        $scope.renewActiveExpense();
        $scope.updateExpenses = function () {
            Expense.get().success(function (data) {
                $scope.expenses = data.expenses;
            }).error(function (data) {
                console.log('er', data);
            });;
        }
        if ($scope.user.access !== false) {
            $http.defaults.headers.common.Authorization = 'Basic ' + $scope.user.access;
            $scope.updateExpenses();
        }
        $scope.activecard = ($scope.user.access && $cookieStore.get('activecard')) || ($cookieStore.get('activecard') == 'login' ? 'login' : 'signup');
        $scope.resetError = function () {
            $scope.error = {
                value: false,
                message: ''
            };
        };
        $scope.resetSuccess = function () {
            $scope.success = {
                value: false,
                message: ''
            };
        };
        $scope.hideAddExpense = function () {
            $scope.showAddExpense = false;
        };
        $scope.showAdd = function () {
            $scope.showAddExpense = true;
        };
        $scope.activatecard = function (card) {
            if (card === 'home') {
                if (!!$scope.user.access) {
                    return;
                }
            }
            $scope.activecard = card;
            $cookieStore.put('activecard', card);
        };
        $scope.editExpense = function (expense) {
            $scope.showAdd();
            expense.amount = parseFloat(expense.amount);
            expense.date = new Date(expense.date + ' UTC');
            $scope.activeExpense = expense;
        }
        $scope.saveExpense = function () {
            $scope.error.value = false;
            Expense.save($scope.activeExpense)
                .success(function (data) {
                    $scope.hideAddExpense();
                    $scope.renewActiveExpense();
                    $scope.success = {
                        value: true,
                        message: 'Expenses Updated!'
                    };
                    $scope.updateExpenses();
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
        $scope.loginUser = function () {
            $scope.error.value = false;
            User.login($scope.user)
                .success(function (data) {
                    console.log(data);
                    data.message.access = btoa($scope.user.email + ":" + $scope.user.password);
                    User.updateUser(data.message);
                    $cookieStore.put('activecard', 'home');
                    $scope.activecard = 'home';
                    $scope.user = User.getUser();
                    $scope.updateExpenses();
                })
                .error(function (data) {
                    $scope.error = {
                        value: data.error,
                        message: data.message
                    };
                }).finally(function () {});
        };
        $scope.signupUser = function () {
            $scope.loading = true;
            $scope.error.value = false;
            User.signup($scope.user)
                .success(function (data) {
                    console.log(data);
                    var access_token = btoa($scope.user.email + ":" + $scope.user.password);
                    $scope.user.access = access_token;
                    User.updateUser($scope.user);
                    $cookieStore.put('activecard', 'home');
                    $scope.activecard = 'home';
                    $scope.user = User.getUser();
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
            User.updateUser($scope.user);
            $scope.activecard = 'login';
            $cookieStore.put('activecard', 'login');
            User.logout();
        };
        $scope.submitExpense = function () {
            // save the expense. pass in expense data from the form
            // use the function we created in our service
            Expense.save($scope.expenseData)
                .success(function (data) {
                    // if successful, we'll need to refresh the expense list
                    Expense.get()
                        .success(function (getData) {
                            $scope.expenses = getData;
                        });

                })
                .error(function (data) {
                    console.log('er', data);
                });
        };

    };

    var userModel = function ($http, $cookieStore) {
        var usr = $cookieStore.get('user') || {
            email: '',
            name: '',
            access: false
        };
        return {
            getUser: function () {
                return angular.fromJson($cookieStore.get('user')) || usr;
            },
            updateUser: function (userData) {
                $http.defaults.headers.common.Authorization = 'Basic ' + userData.access;
                return $cookieStore.put('user', angular.toJson(userData));
            },
            logout: function () {
                return $cookieStore.remove('user');
            },
            loggedin: function () {
                return $cookieStore.get('user') || false;
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
                return $http.get('/backend/public/api/expense');
            },
            // save a expense (pass in expense data)
            save: function (expenseData) {
                expenseData.date = expenseData.date.toISOString();
                return $http({
                    method: !!expenseData.id ? 'PUT' : 'POST',
                    url: '/backend/public/api/expense' + (!!expenseData.id ? '/' + expenseData.id : ''),
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
    xPenny.filter('timeago', function () {
        return function (date) {
            return moment(date).fromNow();
        };
    });
}).call(this);