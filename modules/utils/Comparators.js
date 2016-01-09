var devices = "Result";

module.exports = {

  hourComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isHourEqual(deviceCaptureTime, timeToCompare);
  },
  dayComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isDayEqual(deviceCaptureTime, timeToCompare);
  },
  walkerComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isDayEqual(deviceCaptureTime, timeToCompare) && isWalking(device.Speed);
  },
  walkerComparatorDay: function(deviceCaptureTime, timeToCompare, device) {
    return isHourEqual(deviceCaptureTime, timeToCompare) && isWalking(device.Speed);
  },
  runnerComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isDayEqual(deviceCaptureTime, timeToCompare) && !isWalking(device.Speed);
  },
  runnerComparatorDay: function(deviceCaptureTime, timeToCompare, device) {
    return isHourEqual(deviceCaptureTime, timeToCompare) && !isWalking(device.Speed);
  }
}

function isWalking(speed)  {
  var maxWalkingSpeed = 3; //in meters per second
  return speed < maxWalkingSpeed;
}

function isHourEqual(deviceCaptureTime, timeToCompare)  {
  return deviceCaptureTime.getHours() == timeToCompare.getHours();
}

function isDayEqual(deviceCaptureTime, timeToCompare) {
  //Set time to 00:00:00 to compare days only
  deviceCaptureTime.setHours(0, 0, 0, 0);
  timeToCompare.setHours(0, 0, 0, 0);

  return deviceCaptureTime.getTime() == timeToCompare.getTime();
}
