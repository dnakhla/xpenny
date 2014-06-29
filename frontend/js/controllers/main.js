var expenseController = function ($scope, $cookieStore, $http, $filter, Expense, User) {
    $scope.loading = false;
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
    $scope.expensesSorting = {
        sort: 'date',
        reverse: true
    };
    $scope.renewActiveExpense = function () {
        $scope.activeExpense = {
            amount: null,
            description: '',
            comment: '',
            date: new Date()
        };
    };
    $scope.getTotal = function () {
        //@TODO add this
    };
    $scope.user = User.getUser();
    $scope.renewActiveExpense();
    $scope.updateExpenses = function () {
        $scope.loading = true;
        Expense.get().success(function (data) {
            $scope.expenses = data.expenses;
            //            $scope.getTotal();
        }).error(function (data) {
            console.log('er', data);
        }).finally(function () {
            $scope.loading = false;
        });
    };
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
        $scope.loading = true;
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

            });
    };
    $scope.deleteExpense = function () {
        $scope.loading = true;
        Expense.destroy($scope.activeExpense)
            .success(function (data) {
                $scope.hideAddExpense();
                $scope.renewActiveExpense();
                $scope.success = {
                    value: true,
                    message: 'Expenses Deleted!'
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
        $scope.loading = true;
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
        $scope.expenses = {};
        $scope.renewActiveExpense();
        $scope.activecard = 'login';
        $cookieStore.put('activecard', 'login');
        User.logout();
    };
    $scope.submitExpense = function () {
        $scope.loading = true;
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
            }).finally(function () {
                $scope.loading = false;
            });
    };
};

var timeagoFilter = function () {
    return function (date) {
        date = new Date(date + ' UTC');
        return moment(date).fromNow();
    };
};