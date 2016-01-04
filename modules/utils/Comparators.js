var devices = "Result";

module.exports = {

  /**
   * Returns true if the hour matches
   */
  hourComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isHourEqual(deviceCaptureTime, timeToCompare);
  },
  /**
   * Compares true if the day matches
   */
  dayComparator: function(deviceCaptureTime, timeToCompare, device) {
    return isDayEqual(deviceCaptureTime, timeToCompare);
  },
  walkerComparator: function(deviceCaptureTime, timeToCompare, device) {
    if (isDayEqual(deviceCaptureTime, timeToCompare) && isWalking(device.Speed)) {
      return true;
    }
    return false;
  },
  walkerComparatorDay: function(deviceCaptureTime, timeToCompare, device) {
    if (isHourEqual(deviceCaptureTime, timeToCompare) && isWalking(device.Speed)) {
      return true;
    }
    return false;
  },
  runnerComparator: function(deviceCaptureTime, timeToCompare, device) {
    if (isDayEqual(deviceCaptureTime, timeToCompare) && !isWalking(device.Speed)) {
      return true;
    }
    return false;
  },
  runnerComparatorDay: function(deviceCaptureTime, timeToCompare, device) {
    if (isHourEqual(deviceCaptureTime, timeToCompare) && !isWalking(device.Speed)) {
      return true;
    }
    return false;
  }
}

function isWalking(speed)  {
  if (speed < 0.5) {
    return true;
  }
  return false;
}

function isHourEqual(deviceCaptureTime, timeToCompare)  {
  if (deviceCaptureTime.getHours() == timeToCompare.getHours()) {
    return true;
  }
  return false;
}

function isDayEqual(deviceCaptureTime, timeToCompare) {
  //Set time to 00:00:00 to compare days only
  deviceCaptureTime.setHours(0, 0, 0, 0);
  timeToCompare.setHours(0, 0, 0, 0);

  if (deviceCaptureTime.getTime() == timeToCompare.getTime()) {
    return true;
  }

  return false;
}
