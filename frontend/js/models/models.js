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
            destroy: function (expenseData) {
                return $http.delete('/backend/public/api/expense/' + expenseData.id);
            }
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