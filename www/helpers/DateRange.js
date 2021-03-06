
export default function DateRange(val) {
  function BuildGetter(val) {
    if (val.startsWith('-') || val.startsWith('+')) {
      var num = val.substring(0, val.length - 1);
      var type = val.substring(val.length - 1);

      return function () {
        return moment().startOf('day').add(num, type);
      };
    }
  }

  this.getId = function () { return val; };

  if (val == 'all') {
    this.getStartDate = function () { return null; };
    this.getEndDate = function () { return null; };
  }
  else {
    var parts = val.split(',');

    var start = parts[0];
    var end = parts.length > 1 ? parts[1] : '-0d';

    this.getStartDate = BuildGetter(start);
    this.getEndDate = BuildGetter(end);
  }
};

DateRange.areSame = function (r1, r2) {
  if (!r1 && !r2)
    return true;

  if (!r1 || !r2)
    return false;

  return r1.getId() == r2.getId();
};

DateRange.prototype.toString = function () {
  return this.getId();
};
