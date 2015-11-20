var oReq = new XMLHttpRequest(); //New request object
oReq.onload = function() {

var jsonResponse = JSON.parse(this.responseText);

        var obj = $.parseJSON(this.responseText);
        var devicesArray = obj['Wifi-Devices'];
        var result = new Array();

        var dates = new Array();
        dates.push('x');
        var counts = new Array();
        counts.push('Amount of Wifi-Devices');

        $.each(devicesArray, function (index, deviceCount) {
          dates.push(new Date(deviceCount['date']));
          counts.push(deviceCount['count']);
        });

        var chart = c3.generate({
            bindto: '#chart',
            data: {
                x: 'x',
                columns: [
                    dates,
                    counts
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m.%Y'
                    }
                }
            }
        });
};

//oReq.open("get", "/wifidevicescount?fy=2015&fm=11&fd=10&ty=2015&tm=11&td=20", true);
//oReq.send();
