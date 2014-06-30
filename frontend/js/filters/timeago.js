var timeagoFilter = function () {
    return function (date) {
        date = new Date(date + ' UTC');
        return moment(date).fromNow();
    };
};