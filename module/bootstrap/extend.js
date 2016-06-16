window.alert = function (message) {
    var modal = $('#modal-alert');
    modal.find('.modal-body').html(message);
    modal.modal('show');
};

window.confirm = function (message) {
    var defer = $.Deferred();
    var modal = $('#modal-confirm');
    modal.find('.modal-body').html(message);
    modal.modal('show');

    modal.find('.resolve').off();
    modal.find('.reject').off();

    modal.find('.resolve').on('click', function () {
        defer.resolve();
    });

    modal.find('.reject').on('click', function () {
        defer.reject();
    });

    return defer.promise();
};

window.onerror = function (error, url, line) {
    Util.notification('error', error + '<br>' + url + ':' + line, 'Javascript Error');
};