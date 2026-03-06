// node_modules/astronomia/src/base.js
var K = 0.01720209895;
var AU = 149597870;
var SOblJ2000 = 0.397777156;
var COblJ2000 = 0.917482062;
function lightTime(dist) {
  return 0.0057755183 * dist;
}
var JMod = 24000005e-1;
var J2000 = 2451545;
var J1900 = 2415020;
var B1900 = 24150203135e-4;
var B1950 = 24332824235e-4;
var JulianYear = 365.25;
var JulianCentury = 36525;
var BesselianYear = 365.2421988;
var meanSiderealYear = 365.25636;
function JulianYearToJDE(jy) {
  return J2000 + JulianYear * (jy - 2e3);
}
function JDEToJulianYear(jde) {
  return 2e3 + (jde - J2000) / JulianYear;
}
function BesselianYearToJDE(by) {
  return B1900 + BesselianYear * (by - 1900);
}
function JDEToBesselianYear(jde) {
  return 1900 + (jde - B1900) / BesselianYear;
}
function J2000Century(jde) {
  return (jde - J2000) / JulianCentury;
}
function illuminated(i) {
  return (1 + Math.cos(i)) * 0.5;
}
var Coord = class {
  /**
   * celestial coordinates in right ascension and declination
   * or ecliptic coordinates in longitude and latitude
   *
   * @param {number} ra - right ascension (or longitude)
   * @param {number} dec - declination (or latitude)
   * @param {number} [range] - distance
   * @param {number} [elongation] - elongation
   */
  constructor(ra, dec, range, elongation) {
    this._ra = ra || 0;
    this._dec = dec || 0;
    this.range = range;
    this.elongation = elongation;
  }
  /**
   * right ascension
   * @return {number}
   */
  get ra() {
    return this._ra;
  }
  set ra(ra) {
    this._ra = ra;
  }
  /**
   * declination
   * @return {number}
   */
  get dec() {
    return this._dec;
  }
  set dec(dec) {
    this._dec = dec;
  }
  /**
   * right ascension (or longitude)
   * @return {number}
   */
  get lon() {
    return this._ra;
  }
  set lon(ra) {
    this._ra = ra;
  }
  /**
   * declination (or latitude)
   * @return {number}
   */
  get lat() {
    return this._dec;
  }
  set lat(dec) {
    this._dec = dec;
  }
};
function limb(equ, appSun) {
  const \u03B1 = equ.ra;
  const \u03B4 = equ.dec;
  const \u03B10 = appSun.ra;
  const \u03B40 = appSun.dec;
  const s\u03B4 = Math.sin(\u03B4);
  const c\u03B4 = Math.cos(\u03B4);
  const s\u03B40 = Math.sin(\u03B40);
  const c\u03B40 = Math.cos(\u03B40);
  const s\u03B10\u03B1 = Math.sin(\u03B10 - \u03B1);
  const c\u03B10\u03B1 = Math.cos(\u03B10 - \u03B1);
  let \u03C7 = Math.atan2(c\u03B40 * s\u03B10\u03B1, s\u03B40 * c\u03B4 - c\u03B40 * s\u03B4 * c\u03B10\u03B1);
  if (\u03C7 < 0) {
    \u03C7 += 2 * Math.PI;
  }
  return \u03C7;
}
var SmallAngle = 10 * Math.PI / 180 / 60;
var CosSmallAngle = Math.cos(SmallAngle);
function pmod(x, y) {
  let r = x % y;
  if (r < 0) {
    r += y;
  }
  return r;
}
function horner(x, ...c) {
  if (Array.isArray(c[0])) {
    c = c[0];
  }
  let i = c.length - 1;
  let y = c[i];
  while (i > 0) {
    i--;
    y = y * x + c[i];
  }
  return y;
}
function floorDiv(x, y) {
  const q = x / y;
  return Math.floor(q);
}
function cmp(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
function sincos(\u03B5) {
  return [Math.sin(\u03B5), Math.cos(\u03B5)];
}
function toRad(deg) {
  return Math.PI / 180 * deg;
}
function toDeg(rad2) {
  return 180 / Math.PI * rad2;
}
function modf(float) {
  const i = Math.trunc(float);
  const f = Math.abs(float - i);
  return [i, f];
}
function round(float, precision = 14) {
  return parseFloat(float.toFixed(precision));
}
function errorCode(msg, code) {
  const err = new Error(msg);
  err.code = code;
  return err;
}
var base_default = {
  K,
  AU,
  SOblJ2000,
  COblJ2000,
  lightTime,
  JMod,
  J2000,
  J1900,
  B1900,
  B1950,
  JulianYear,
  JulianCentury,
  BesselianYear,
  meanSiderealYear,
  JulianYearToJDE,
  JDEToJulianYear,
  BesselianYearToJDE,
  JDEToBesselianYear,
  J2000Century,
  illuminated,
  Coord,
  limb,
  SmallAngle,
  CosSmallAngle,
  pmod,
  horner,
  floorDiv,
  cmp,
  sincos,
  toRad,
  toDeg,
  modf,
  round,
  errorCode
};

// node_modules/astronomia/src/interpolation.js
var int = Math.trunc;
var errorNot3 = new Error("Argument y must be length 3");
var errorNot4 = new Error("Argument y must be length 4");
var errorNot5 = new Error("Argument y must be length 5");
var errorNoXRange = new Error("Argument x3 (or x5) cannot equal x1");
var errorNOutOfRange = new Error("Interpolating factor n must be in range -1 to 1");
var errorNoExtremum = new Error("No extremum in table");
var errorExtremumOutside = new Error("Extremum falls outside of table");
var errorZeroOutside = new Error("Zero falls outside of table");
var errorNoConverge = new Error("Failure to converge");
var Len3 = class {
  /**
   * NewLen3 prepares a Len3 object from a table of three rows of x and y values.
   *
   * X values must be equally spaced, so only the first and last are supplied.
   * X1 must not equal to x3.  Y must be a slice of three y values.
   *
   * @throws Error
   * @param {Number} x1 - is the x value corresponding to the first y value of the table.
   * @param {Number} x3 - is the x value corresponding to the last y value of the table.
   * @param {Number[]} y - is all y values in the table. y.length should be >= 3.0
   */
  constructor(x1, x3, y) {
    if (y.length !== 3) {
      throw errorNot3;
    }
    if (x3 === x1) {
      throw errorNoXRange;
    }
    this.x1 = x1;
    this.x3 = x3;
    this.y = y;
    this.a = y[1] - y[0];
    this.b = y[2] - y[1];
    this.c = this.b - this.a;
    this.abSum = this.a + this.b;
    this.xSum = x3 + x1;
    this.xDiff = x3 - x1;
  }
  /**
   * InterpolateX interpolates for a given x value.
   */
  interpolateX(x) {
    const n = (2 * x - this.xSum) / this.xDiff;
    return this.interpolateN(n);
  }
  /**
   * InterpolateXStrict interpolates for a given x value,
   * restricting x to the range x1 to x3 given to the constructor NewLen3.
   */
  interpolateXStrict(x) {
    const n = (2 * x - this.xSum) / this.xDiff;
    const y = this.interpolateNStrict(n);
    return y;
  }
  /**
   * InterpolateN interpolates for (a given interpolating factor n.
   *
   * This is interpolation formula (3.3)
   *
   * @param n - The interpolation factor n is x-x2 in units of the tabular x interval.
   * (See Meeus p. 24.)
   * @return {number} interpolation value
   */
  interpolateN(n) {
    return this.y[1] + n * 0.5 * (this.abSum + n * this.c);
  }
  /**
   * InterpolateNStrict interpolates for (a given interpolating factor n.
   *
   * @param {number} n - n is restricted to the range [-1..1] corresponding to the range x1 to x3
   * given to the constructor of Len3.
   * @return {number} interpolation value
   */
  interpolateNStrict(n) {
    if (n < -1 || n > 1) {
      throw errorNOutOfRange;
    }
    return this.interpolateN(n);
  }
  /**
   * Extremum returns the x and y values at the extremum.
   *
   * Results are restricted to the range of the table given to the constructor
   * new Len3.
   */
  extremum() {
    if (this.c === 0) {
      throw errorNoExtremum;
    }
    const n = this.abSum / (-2 * this.c);
    if (n < -1 || n > 1) {
      throw errorExtremumOutside;
    }
    const x = 0.5 * (this.xSum + this.xDiff * n);
    const y = this.y[1] - this.abSum * this.abSum / (8 * this.c);
    return [x, y];
  }
  /**
   * Len3Zero finds a zero of the quadratic function represented by the table.
   *
   * That is, it returns an x value that yields y=0.
   *
   * Argument strong switches between two strategies for the estimation step.
   * when iterating to converge on the zero.
   *
   * Strong=false specifies a quick and dirty estimate that works well
   * for gentle curves, but can work poorly or fail on more dramatic curves.
   *
   * Strong=true specifies a more sophisticated and thus somewhat more
   * expensive estimate.  However, if the curve has quick changes, This estimate
   * will converge more reliably and in fewer steps, making it a better choice.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen3.
   */
  zero(strong) {
    let f;
    if (strong) {
      f = (n02) => {
        return n02 - (2 * this.y[1] + n02 * (this.abSum + this.c * n02)) / (this.abSum + 2 * this.c * n02);
      };
    } else {
      f = (n02) => {
        return -2 * this.y[1] / (this.abSum + this.c * n02);
      };
    }
    const [n0, ok] = iterate(0, f);
    if (!ok) {
      throw errorNoConverge;
    }
    if (n0 > 1 || n0 < -1) {
      throw errorZeroOutside;
    }
    return 0.5 * (this.xSum + this.xDiff * n0);
  }
};
function len3ForInterpolateX(x, x1, xN, y) {
  let y3 = y;
  if (y.length > 3) {
    const interval = (xN - x1) / (y.length - 1);
    if (interval === 0) {
      throw errorNoXRange;
    }
    let nearestX = int((x - x1) / interval + 0.5);
    if (nearestX < 1) {
      nearestX = 1;
    } else if (nearestX > y.length - 2) {
      nearestX = y.length - 2;
    }
    y3 = y.slice(nearestX - 1, nearestX + 2);
    xN = x1 + (nearestX + 1) * interval;
    x1 = x1 + (nearestX - 1) * interval;
  }
  return new Len3(x1, xN, y3);
}
var iterate = function(n0, f) {
  for (let limit = 0; limit < 50; limit++) {
    const n1 = f(n0);
    if (!isFinite(n1) || isNaN(n1)) {
      break;
    }
    if (Math.abs((n1 - n0) / n0) < 1e-15) {
      return [n1, true];
    }
    n0 = n1;
  }
  return [0, false];
};
function len4Half(y) {
  if (y.length !== 4) {
    throw errorNot4;
  }
  return (9 * (y[1] + y[2]) - y[0] - y[3]) / 16;
}
var Len5 = class {
  /**
   * NewLen5 prepares a Len5 object from a table of five rows of x and y values.
   *
   * X values must be equally spaced, so only the first and last are suppliethis.
   * X1 must not equal x5.  Y must be a slice of five y values.
   */
  constructor(x1, x5, y) {
    if (y.length !== 5) {
      throw errorNot5;
    }
    if (x5 === x1) {
      throw errorNoXRange;
    }
    this.x1 = x1;
    this.x5 = x5;
    this.y = y;
    this.y3 = y[2];
    this.a = y[1] - y[0];
    this.b = y[2] - y[1];
    this.c = y[3] - y[2];
    this.d = y[4] - y[3];
    this.e = this.b - this.a;
    this.f = this.c - this.b;
    this.g = this.d - this.c;
    this.h = this.f - this.e;
    this.j = this.g - this.f;
    this.k = this.j - this.h;
    this.xSum = x5 + x1;
    this.xDiff = x5 - x1;
    this.interpCoeff = [
      // (3.8) p. 28
      this.y3,
      (this.b + this.c) / 2 - (this.h + this.j) / 12,
      this.f / 2 - this.k / 24,
      (this.h + this.j) / 12,
      this.k / 24
    ];
  }
  /**
   * InterpolateX interpolates for (a given x value.
   */
  interpolateX(x) {
    const n = (4 * x - 2 * this.xSum) / this.xDiff;
    return this.interpolateN(n);
  }
  /**
   * InterpolateXStrict interpolates for a given x value,
   * restricting x to the range x1 to x5 given to the the constructor NewLen5.
   */
  interpolateXStrict(x) {
    const n = (4 * x - 2 * this.xSum) / this.xDiff;
    const y = this.interpolateNStrict(n);
    return y;
  }
  /**
   * InterpolateN interpolates for (a given interpolating factor n.
   *
   * The interpolation factor n is x-x3 in units of the tabular x interval.
   * (See Meeus p. 28.)
   */
  interpolateN(n) {
    return base_default.horner(n, ...this.interpCoeff);
  }
  /**
   * InterpolateNStrict interpolates for (a given interpolating factor n.
   *
   * N is restricted to the range [-1..1].  This is only half the range given
   * to the constructor NewLen5, but is the recommendation given on p. 31.0
   */
  interpolateNStrict(n) {
    if (n < -1 || n > 1) {
      throw errorNOutOfRange;
    }
    return base_default.horner(n, ...this.interpCoeff);
  }
  /**
   * Extremum returns the x and y values at the extremum.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen5.  (Meeus actually recommends restricting the range to one unit of
   * the tabular interval, but that seems a little harsh.)
   */
  extremum() {
    const nCoeff = [
      6 * (this.b + this.c) - this.h - this.j,
      0,
      3 * (this.h + this.j),
      2 * this.k
    ];
    const den = this.k - 12 * this.f;
    if (den === 0) {
      throw errorExtremumOutside;
    }
    const [n0, ok] = iterate(0, function(n02) {
      return base_default.horner(n02, ...nCoeff) / den;
    });
    if (!ok) {
      throw errorNoConverge;
    }
    if (n0 < -2 || n0 > 2) {
      throw errorExtremumOutside;
    }
    const x = 0.5 * this.xSum + 0.25 * this.xDiff * n0;
    const y = base_default.horner(n0, ...this.interpCoeff);
    return [x, y];
  }
  /**
   * Len5Zero finds a zero of the quartic function represented by the table.
   *
   * That is, it returns an x value that yields y=0.
   *
   * Argument strong switches between two strategies for the estimation step.
   * when iterating to converge on the zero.
   *
   * Strong=false specifies a quick and dirty estimate that works well
   * for gentle curves, but can work poorly or fail on more dramatic curves.
   *
   * Strong=true specifies a more sophisticated and thus somewhat more
   * expensive estimate.  However, if the curve has quick changes, This estimate
   * will converge more reliably and in fewer steps, making it a better choice.
   *
   * Results are restricted to the range of the table given to the constructor
   * NewLen5.
   */
  zero(strong) {
    let f;
    if (strong) {
      const M = this.k / 24;
      const N = (this.h + this.j) / 12;
      const P = this.f / 2 - M;
      const Q = (this.b + this.c) / 2 - N;
      const numCoeff = [this.y3, Q, P, N, M];
      const denCoeff = [Q, 2 * P, 3 * N, 4 * M];
      f = function(n02) {
        return n02 - base_default.horner(n02, ...numCoeff) / base_default.horner(n02, ...denCoeff);
      };
    } else {
      const numCoeff = [
        -24 * this.y3,
        0,
        this.k - 12 * this.f,
        -2 * (this.h + this.j),
        -this.k
      ];
      const den = 12 * (this.b + this.c) - 2 * (this.h + this.j);
      f = function(n02) {
        return base_default.horner(n02, ...numCoeff) / den;
      };
    }
    const [n0, ok] = iterate(0, f);
    if (!ok) {
      throw errorNoConverge;
    }
    if (n0 > 2 || n0 < -2) {
      throw errorZeroOutside;
    }
    const x = 0.5 * this.xSum + 0.25 * this.xDiff * n0;
    return x;
  }
};
function lagrange(x, table) {
  let sum2 = 0;
  table.forEach((ti, i) => {
    const xi = ti[0];
    let prod = 1;
    table.forEach((tj, j) => {
      if (i !== j) {
        const xj = tj[0];
        prod *= (x - xj) / (xi - xj);
      }
    });
    sum2 += ti[1] * prod;
  });
  return sum2;
}
function lagrangePoly(table) {
  const sum2 = new Array(table.length).fill(0);
  const prod = new Array(table.length).fill(0);
  const last2 = table.length - 1;
  for (let i = 0; i < table.length; i++) {
    const xi = table[i][0] || table[i].x || 0;
    const yi = table[i][1] || table[i].y || 0;
    prod[last2] = 1;
    let den = 1;
    let n = last2;
    for (let j = 0; j < table.length; j++) {
      if (i !== j) {
        const xj = table[j][0] || table[j].x || 0;
        prod[n - 1] = prod[n] * -xj;
        for (let k = n; k < last2; k++) {
          prod[k] -= prod[k + 1] * xj;
        }
        n--;
        den *= xi - xj;
      }
    }
    prod.forEach((pj, j) => {
      sum2[j] += yi * pj / den;
    });
  }
  return sum2;
}
function linear(x, x1, xN, y) {
  const interval = (xN - x1) / (y.length - 1);
  if (interval === 0) {
    throw errorNoXRange;
  }
  let nearestX = Math.floor((x - x1) / interval);
  if (nearestX < 0) {
    nearestX = 0;
  } else if (nearestX > y.length - 2) {
    nearestX = y.length - 2;
  }
  const y2 = y.slice(nearestX, nearestX + 2);
  const x01 = x1 + nearestX * interval;
  return y2[0] + (y[1] - y[0]) * (x - x01) / interval;
}
var interpolation_default = {
  errorNot3,
  errorNot4,
  errorNot5,
  errorNoXRange,
  errorNOutOfRange,
  errorNoExtremum,
  errorExtremumOutside,
  errorZeroOutside,
  errorNoConverge,
  Len3,
  len3ForInterpolateX,
  iterate,
  len4Half,
  Len5,
  lagrange,
  lagrangePoly,
  linear
};

// node_modules/astronomia/src/angle.js
var { abs, acos, asin, atan2, cos, hypot, sin, sqrt, tan } = Math;

// node_modules/astronomia/src/sexagesimal.js
var Angle = class {
  /**
  * constructs a new Angle value from sign, degree, minute, and second
  * components.
  * @param {Number|Boolean} angleOrNeg - angle in radians or sign, true if negative (required to attribute -0°30')
  * __Four arguments__
  * @param {Number} [d] - (int) degree
  * @param {Number} [m] - (int) minute
  * @param {Number} [s] - (float) second
  */
  constructor(angleOrNeg, d3, m3, s2) {
    if (arguments.length === 1) {
      this.angle = Number(angleOrNeg);
    } else {
      this.setDMS(!!angleOrNeg, d3, m3, s2);
    }
  }
  /**
   * SetDMS sets the value of an FAngle from sign, degree, minute, and second
   * components.
   * The receiver is returned as a convenience.
   * @param {Boolean} neg - sign, true if negative
   * @param {Number} d - (int) degree
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   * @returns {Angle}
   */
  setDMS(neg = false, d3 = 0, m3 = 0, s2 = 0) {
    this.angle = DMSToDeg(neg, d3, m3, s2) * Math.PI / 180;
    return this;
  }
  /**
   * sets angle
   * @param {Number} angle - (float) angle in radians
   * @returns {Angle}
   */
  setAngle(angle) {
    this.angle = angle;
    return this;
  }
  /**
   * Rad returns the angle in radians.
   * @returns {Number} angle in radians
   */
  rad() {
    return this.angle;
  }
  /**
   * Deg returns the angle in degrees.
   * @returns {Number} angle in degree
   */
  deg() {
    return this.angle * 180 / Math.PI;
  }
  /**
   * toDMS converts to parsed sexagesimal angle component.
   */
  toDMS() {
    return degToDMS(this.deg());
  }
  /**
   * Print angle in degree using `d°m´s.ss″`
   * @param {Number} [precision] - precision of `s.ss`
   * @returns {String}
   */
  toString(precision) {
    let [neg, d3, m3, s2] = this.toDMS();
    s2 = round2(s2, precision).toString().replace(/^0\./, ".");
    const str = (neg ? "-" : "") + (d3 + "\xB0") + (m3 + "\u2032") + (s2 + "\u2033");
    return str;
  }
  /**
   * Print angle in degree using `d°.ff`
   * @param {Number} [precision] - precision of `.ff`
   * @returns {String}
   */
  toDegString(precision) {
    let [i, s2] = modf2(this.deg());
    s2 = round2(s2, precision).toString().replace(/^0\./, ".");
    const str = i + "\xB0" + s2;
    return str;
  }
};
var HourAngle = class extends Angle {
  /**
   * NewHourAngle constructs a new HourAngle value from sign, hour, minute,
   * and second components.
   * @param {Boolean} neg
   * @param {Number} h - (int)
   * @param {Number} m - (int)
   * @param {Number} s - (float)
   * @constructor
   */
  /**
   * SetDMS sets the value of an FAngle from sign, degree, minute, and second
   * components.
   * The receiver is returned as a convenience.
   * @param {Boolean} neg - sign, true if negative
   * @param {Number} h - (int) hour
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   * @returns {Angle}
   */
  setDMS(neg = false, h = 0, m3 = 0, s2 = 0) {
    this.angle = DMSToDeg(neg, h, m3, s2) * 15 * Math.PI / 180;
    return this;
  }
  /**
   * Hour returns the hour angle as hours of time.
   * @returns hour angle
   */
  hour() {
    return this.angle * 12 / Math.PI;
  }
  deg() {
    return this.hour();
  }
  /**
   * Print angle in `HʰMᵐs.ssˢ`
   * @param {Number} precision - precision of `s.ss`
   * @returns {String}
   */
  toString(precision) {
    let [neg, h, m3, s2] = this.toDMS();
    s2 = round2(s2, precision).toString().replace(/^0\./, ".");
    const str = (neg ? "-" : "") + (h + "\u02B0") + (m3 + "\u1D50") + (s2 + "\u02E2");
    return str;
  }
};
function DMSToDeg(neg, d3, m3, s2) {
  s2 = ((d3 * 60 + m3) * 60 + s2) / 3600;
  if (neg) {
    return -s2;
  }
  return s2;
}
function degToDMS(deg) {
  const neg = deg < 0;
  deg = Math.abs(deg);
  let [d3, s2] = modf2(deg % 360);
  const [m3, s1] = modf2(s2 * 60);
  s2 = round2(s1 * 60);
  return [neg, d3, m3, s2];
}
var RA = class extends HourAngle {
  /**
   * constructs a new RA value from hour, minute, and second components.
   * Negative values are not supported, RA wraps values larger than 24
   * to the range [0,24) hours.
   * @param {Number} h - (int) hour
   * @param {Number} m - (int) minute
   * @param {Number} s - (float) second
   */
  constructor(h = 0, m3 = 0, s2 = 0) {
    super(false, h, m3, s2);
    const args = [].slice.call(arguments);
    if (args.length === 1) {
      this.angle = h;
    } else {
      const hr = DMSToDeg(false, h, m3, s2) % 24;
      this.angle = hr * 15 * Math.PI / 180;
    }
  }
  hour() {
    const h = this.angle * 12 / Math.PI;
    return (24 + h % 24) % 24;
  }
};
var Time = class {
  /**
   * @param {boolean|number} negOrTimeInSecs - set `true` if negative; if type is number than time in seconds
   * @param {number} [h] - (int) hour
   * @param {number} [m] - (int) minute
   * @param {number} [s] - (float) second
   * @example
   * new sexa.Time(SECS_OF_DAY)
   * new sexa.Time(false, 15, 22, 7)
   */
  constructor(negOrTimeInSecs, h, m3, s2) {
    if (typeof negOrTimeInSecs === "number") {
      this.time = negOrTimeInSecs;
    } else {
      this.setHMS(negOrTimeInSecs, h, m3, s2);
    }
  }
  setHMS(neg = false, h = 0, m3 = 0, s2 = 0) {
    s2 += (h * 60 + m3) * 60;
    if (neg) {
      s2 = -s2;
    }
    this.time = s2;
  }
  /**
   * @returns {Number} time in seconds.
   */
  sec() {
    return this.time;
  }
  /**
   * @returns {Number} time in minutes.
   */
  min() {
    return this.time / 60;
  }
  /**
   * @returns {Number} time in hours.
   */
  hour() {
    return this.time / 3600;
  }
  /**
   * @returns {Number} time in days.
   */
  day() {
    return this.time / 3600 / 24;
  }
  /**
   * @returns {Number} time in radians, where 1 day = 2 Pi radians.
   */
  rad() {
    return this.time * Math.PI / 12 / 3600;
  }
  /**
   * convert time to HMS
   * @returns {Array} [neg, h, m, s]
   *  {Boolean} neg - sign, true if negative
   *  {Number} h - (int) hour
   *  {Number} m - (int) minute
   *  {Number} s - (float) second
   */
  toHMS() {
    let t = this.time;
    const neg = t < 0;
    t = neg ? -t : t;
    const h = Math.trunc(t / 3600);
    t = t - h * 3600;
    const m3 = Math.trunc(t / 60);
    const s2 = t - m3 * 60;
    return [neg, h, m3, s2];
  }
  /**
   * Print time using `HʰMᵐsˢ.ss`
   * @param {Number} precision - precision of `.ss`
   * @returns {String}
   */
  toString(precision) {
    const [neg, h, m3, s2] = this.toHMS();
    let [si, sf] = modf2(s2);
    if (precision === 0) {
      si = round2(s2, 0);
      sf = 0;
    } else {
      sf = round2(sf, precision).toString().substr(1);
    }
    const str = (neg ? "-" : "") + (h + "\u02B0") + (m3 + "\u1D50") + (si + "\u02E2") + (sf || "");
    return str;
  }
};
var angleFromDeg = (deg) => deg * Math.PI / 180;
var angleFromMin = (min) => min / 60 * Math.PI / 180;
var angleFromSec = (sec) => sec / 3600 * Math.PI / 180;
var degFromAngle = (angle) => angle * 180 / Math.PI;
var secFromAngle = (angle) => angle * 3600 * 180 / Math.PI;
var secFromHourAngle = (ha) => ha * 240 * 180 / Math.PI;
function modf2(float) {
  const i = Math.trunc(float);
  const f = Math.abs(float - i);
  return [i, f];
}
function round2(float, precision = 10) {
  return parseFloat(float.toFixed(precision));
}
var sexagesimal_default = {
  Angle,
  HourAngle,
  DMSToDeg,
  degToDMS,
  RA,
  Time,
  angleFromDeg,
  angleFromMin,
  angleFromSec,
  degFromAngle,
  secFromAngle,
  secFromHourAngle
};

// node_modules/astronomia/src/globe.js
var Ellipsoid = class {
  /**
   * @param {number} radius - equatorial radius
   * @param {number} flat - ellipsiod flattening
   */
  constructor(radius2, flat) {
    this.radius = radius2;
    this.flat = flat;
  }
  /** A is a common identifier for equatorial radius. */
  A() {
    return this.radius;
  }
  /** B is a common identifier for polar radius. */
  B() {
    return this.radius * (1 - this.flat);
  }
  /** eccentricity of a meridian. */
  eccentricity() {
    return Math.sqrt((2 - this.flat) * this.flat);
  }
  /**
   * parallaxConstants computes parallax constants ρ sin φ′ and ρ cos φ′.
   *
   * Arguments are geographic latitude φ in radians and height h
   * in meters above the ellipsoid.
   *
   * @param {number} φ - geographic latitude in radians
   * @param {number} h - height in meters above the ellipsoid
   * @return {number[]} [ρ sin φ′, ρ cos φ] parallax constants [ρsφ, ρcφ]
   */
  parallaxConstants(\u03C6, h) {
    const boa = 1 - this.flat;
    const su = Math.sin(Math.atan(boa * Math.tan(\u03C6)));
    const cu = Math.cos(Math.atan(boa * Math.tan(\u03C6)));
    const s2 = Math.sin(\u03C6);
    const c = Math.cos(\u03C6);
    const hoa = h * 1e-3 / this.radius;
    const \u03C1s\u03C6 = su * boa + hoa * s2;
    const \u03C1c\u03C6 = cu + hoa * c;
    return [\u03C1s\u03C6, \u03C1c\u03C6];
  }
  /**
   * rho is distance from Earth center to a point on the ellipsoid.
   *
   * Result unit is fraction of the equatorial radius.
   * @param {number} φ - geographic latitude in radians
   * @returns {number} // TODO
   */
  rho(\u03C6) {
    return 0.9983271 + 16764e-7 * Math.cos(2 * \u03C6) - 35e-7 * Math.cos(4 * \u03C6);
  }
  /**
   * radiusAtLatitude returns the radius of the circle that is the parallel of
   * latitude at φ.
   *
   * Result unit is Km.
   *
   * @param {number} φ
   * @return {number} radius in km
   */
  radiusAtLatitude(\u03C6) {
    const s2 = Math.sin(\u03C6);
    const c = Math.cos(\u03C6);
    return this.A() * c / Math.sqrt(1 - (2 - this.flat) * this.flat * s2 * s2);
  }
  /**
   * radiusOfCurvature of meridian at latitude φ.
   *
   * Result unit is Km.
   *
   * @param {number} φ
   * @return {number} radius in km
   */
  radiusOfCurvature(\u03C6) {
    const s2 = Math.sin(\u03C6);
    const e2 = (2 - this.flat) * this.flat;
    return this.A() * (1 - e2) / Math.pow(1 - e2 * s2 * s2, 1.5);
  }
  /**
   * distance is distance between two points measured along the surface
   * of an ellipsoid.
   *
   * Accuracy is much better than that of approxAngularDistance or
   * approxLinearDistance.
   *
   * Result unit is Km.
   *
   * @param {Coord} c1
   * @param {Coord} c2
   * @return {number} radius in km
   */
  distance(c1, c2) {
    const [s2f, c2f] = sincos2((c1.lat + c2.lat) / 2);
    const [s2g, c2g] = sincos2((c1.lat - c2.lat) / 2);
    const [s2\u03BB, c2\u03BB] = sincos2((c1.lon - c2.lon) / 2);
    const s2 = s2g * c2\u03BB + c2f * s2\u03BB;
    const c = c2g * c2\u03BB + s2f * s2\u03BB;
    const \u03C9 = Math.atan(Math.sqrt(s2 / c));
    const r = Math.sqrt(s2 * c) / \u03C9;
    const d3 = 2 * \u03C9 * this.radius;
    const h1 = (3 * r - 1) / (2 * c);
    const h2 = (3 * r + 1) / (2 * s2);
    return d3 * (1 + this.flat * (h1 * s2f * c2g - h2 * c2f * s2g));
  }
};
var Earth76 = new Ellipsoid(6378.14, 1 / 298.257);
function sincos2(x) {
  const s2 = Math.sin(x);
  const c = Math.cos(x);
  return [s2 * s2, c * c];
}

// node_modules/astronomia/src/coord.js
var Ecliptic = class {
  /**
   * IMPORTANT: Longitudes are measured *positively* westwards
   * e.g. Washington D.C. +77°04; Vienna -16°23'
   * @param {Number|LonLat} [lon] - Longitude (λ) in radians
   * @param {Number} [lat] - Latitude (β) in radians
   */
  constructor(lon, lat) {
    if (typeof lon === "object") {
      lat = lon.lat;
      lon = lon.lon;
    }
    this.lon = lon || 0;
    this.lat = lat || 0;
  }
  /**
   * converts ecliptic coordinates to equatorial coordinates.
   * @param {Number} ε - Obliquity
   * @returns {Equatorial}
   */
  toEquatorial(\u03B5) {
    const [\u03B5sin, \u03B5cos] = base_default.sincos(\u03B5);
    const [s\u03B2, c\u03B2] = base_default.sincos(this.lat);
    const [s\u03BB, c\u03BB] = base_default.sincos(this.lon);
    let ra = Math.atan2(s\u03BB * \u03B5cos - s\u03B2 / c\u03B2 * \u03B5sin, c\u03BB);
    if (ra < 0) {
      ra += 2 * Math.PI;
    }
    const dec = Math.asin(s\u03B2 * \u03B5cos + c\u03B2 * \u03B5sin * s\u03BB);
    return new Equatorial(ra, dec);
  }
};
var Equatorial = class {
  /**
   * @param {Number} ra - (float) Right ascension (α) in radians
   * @param {Number} dec - (float) Declination (δ) in radians
   */
  constructor(ra = 0, dec = 0) {
    this.ra = ra;
    this.dec = dec;
  }
  /**
   * EqToEcl converts equatorial coordinates to ecliptic coordinates.
   * @param {Number} ε - Obliquity
   * @returns {Ecliptic}
   */
  toEcliptic(\u03B5) {
    const [\u03B5sin, \u03B5cos] = base_default.sincos(\u03B5);
    const [s\u03B1, c\u03B1] = base_default.sincos(this.ra);
    const [s\u03B4, c\u03B4] = base_default.sincos(this.dec);
    const lon = Math.atan2(s\u03B1 * \u03B5cos + s\u03B4 / c\u03B4 * \u03B5sin, c\u03B1);
    const lat = Math.asin(s\u03B4 * \u03B5cos - c\u03B4 * \u03B5sin * s\u03B1);
    return new Ecliptic(lon, lat);
  }
  /**
   * EqToHz computes Horizontal coordinates from equatorial coordinates.
   *
   * Argument g is the location of the observer on the Earth.  Argument st
   * is the sidereal time at Greenwich.
   *
   * Sidereal time must be consistent with the equatorial coordinates.
   * If coordinates are apparent, sidereal time must be apparent as well.
   *
   * @param {GlobeCoord} g - coordinates of observer on Earth
   * @param {Number} st - sidereal time at Greenwich at time of observation
   * @returns {Horizontal}
   */
  toHorizontal(g, st) {
    const H = new sexagesimal_default.Time(st).rad() - g.lon - this.ra;
    const [sH, cH] = base_default.sincos(H);
    const [s\u03C6, c\u03C6] = base_default.sincos(g.lat);
    const [s\u03B4, c\u03B4] = base_default.sincos(this.dec);
    const azimuth = Math.atan2(sH, cH * s\u03C6 - s\u03B4 / c\u03B4 * c\u03C6);
    const altitude = Math.asin(s\u03C6 * s\u03B4 + c\u03C6 * c\u03B4 * cH);
    return new Horizontal(azimuth, altitude);
  }
  /**
   * EqToGal converts equatorial coordinates to galactic coordinates.
   *
   * Equatorial coordinates must be referred to the standard equinox of B1950.0.
   * For conversion to B1950, see package precess and utility functions in
   * package "common".
   *
   * @returns {Galactic}
   */
  toGalactic() {
    const [sd\u03B1, cd\u03B1] = base_default.sincos(galacticNorth1950.ra - this.ra);
    const [sg\u03B4, cg\u03B4] = base_default.sincos(galacticNorth1950.dec);
    const [s\u03B4, c\u03B4] = base_default.sincos(this.dec);
    const x = Math.atan2(sd\u03B1, cd\u03B1 * sg\u03B4 - s\u03B4 / c\u03B4 * cg\u03B4);
    const lon = (galactic0Lon1950 + 1.5 * Math.PI - x) % (2 * Math.PI);
    const lat = Math.asin(s\u03B4 * sg\u03B4 + c\u03B4 * cg\u03B4 * cd\u03B1);
    return new Galactic(lon, lat);
  }
};
var Horizontal = class {
  constructor(az = 0, alt = 0) {
    this.az = az;
    this.alt = alt;
  }
  /**
   * transforms horizontal coordinates to equatorial coordinates.
   *
   * Sidereal time must be consistent with the equatorial coordinates.
   * If coordinates are apparent, sidereal time must be apparent as well.
   * @param {GlobeCoord} g - coordinates of observer on Earth (lat, lon)
   * @param {Number} st - sidereal time at Greenwich at time of observation.
   * @returns {Equatorial} (right ascension, declination)
   */
  toEquatorial(g, st) {
    const [sA, cA] = base_default.sincos(this.az);
    const [sh, ch] = base_default.sincos(this.alt);
    const [s\u03C6, c\u03C6] = base_default.sincos(g.lat);
    const H = Math.atan2(sA, cA * s\u03C6 + sh / ch * c\u03C6);
    const ra = base_default.pmod(new sexagesimal_default.Time(st).rad() - g.lon - H, 2 * Math.PI);
    const dec = Math.asin(s\u03C6 * sh - c\u03C6 * ch * cA);
    return new Equatorial(ra, dec);
  }
};
var Galactic = class {
  constructor(lon = 0, lat = 0) {
    this.lon = lon;
    this.lat = lat;
  }
  /**
   * GalToEq converts galactic coordinates to equatorial coordinates.
   *
   * Resulting equatorial coordinates will be referred to the standard equinox of
   * B1950.0.  For subsequent conversion to other epochs, see package precess and
   * utility functions in package meeus.
   *
   * @returns {Equatorial} (right ascension, declination)
   */
  toEquatorial() {
    const [sdLon, cdLon] = base_default.sincos(this.lon - galactic0Lon1950 - Math.PI / 2);
    const [sg\u03B4, cg\u03B4] = base_default.sincos(galacticNorth1950.dec);
    const [sb, cb] = base_default.sincos(this.lat);
    const y = Math.atan2(sdLon, cdLon * sg\u03B4 - sb / cb * cg\u03B4);
    const ra = base_default.pmod(y + galacticNorth1950.ra - Math.PI, 2 * Math.PI);
    const dec = Math.asin(sb * sg\u03B4 + cb * cg\u03B4 * cdLon);
    return new Equatorial(ra, dec);
  }
};
var galacticNorth = new Equatorial(
  new sexagesimal_default.RA(12, 49, 0).rad(),
  27.4 * Math.PI / 180
);
var galacticNorth1950 = galacticNorth;
var galacticLon0 = 33 * Math.PI / 180;
var galactic0Lon1950 = galacticLon0;
var coord_default = {
  Ecliptic,
  Equatorial,
  Horizontal,
  Galactic,
  galacticNorth,
  galacticNorth1950,
  galacticLon0,
  galactic0Lon1950
};

// node_modules/astronomia/src/nutation.js
function nutation(jde) {
  const T = base_default.J2000Century(jde);
  const D = base_default.horner(
    T,
    297.85036,
    445267.11148,
    -19142e-7,
    1 / 189474
  ) * Math.PI / 180;
  const M = base_default.horner(
    T,
    357.52772,
    35999.05034,
    -1603e-7,
    -1 / 3e5
  ) * Math.PI / 180;
  const N = base_default.horner(
    T,
    134.96298,
    477198.867398,
    86972e-7,
    1 / 56250
  ) * Math.PI / 180;
  const F = base_default.horner(
    T,
    93.27191,
    483202.017538,
    -36825e-7,
    1 / 327270
  ) * Math.PI / 180;
  const \u03A9 = base_default.horner(
    T,
    125.04452,
    -1934.136261,
    20708e-7,
    1 / 45e4
  ) * Math.PI / 180;
  let \u0394\u03C8 = 0;
  let \u0394\u03B5 = 0;
  for (let i = table22A.length - 1; i >= 0; i--) {
    const row = table22A[i];
    const arg = row.d * D + row.m * M + row.n * N + row.f * F + row.\u03C9 * \u03A9;
    const [s2, c] = base_default.sincos(arg);
    \u0394\u03C8 += s2 * (row.s0 + row.s1 * T);
    \u0394\u03B5 += c * (row.c0 + row.c1 * T);
  }
  \u0394\u03C8 *= 1e-4 / 3600 * (Math.PI / 180);
  \u0394\u03B5 *= 1e-4 / 3600 * (Math.PI / 180);
  return [\u0394\u03C8, \u0394\u03B5];
}
function approxNutation(jde) {
  const T = (jde - base_default.J2000) / 36525;
  const \u03A9 = (125.04452 - 1934.136261 * T) * Math.PI / 180;
  const L2 = (280.4665 + 36000.7698 * T) * Math.PI / 180;
  const N = (218.3165 + 481267.8813 * T) * Math.PI / 180;
  const [s\u03A9, c\u03A9] = base_default.sincos(\u03A9);
  const [s2L, c2L] = base_default.sincos(2 * L2);
  const [s2N, c2N] = base_default.sincos(2 * N);
  const [s2\u03A9, c2\u03A9] = base_default.sincos(2 * \u03A9);
  const \u0394\u03C8 = (-17.2 * s\u03A9 - 1.32 * s2L - 0.23 * s2N + 0.21 * s2\u03A9) / 3600 * (Math.PI / 180);
  const \u0394\u03B5 = (9.2 * c\u03A9 + 0.57 * c2L + 0.1 * c2N - 0.09 * c2\u03A9) / 3600 * (Math.PI / 180);
  return [\u0394\u03C8, \u0394\u03B5];
}
function meanObliquity(jde) {
  return base_default.horner(
    base_default.J2000Century(jde),
    new sexagesimal_default.Angle(false, 23, 26, 21.448).rad(),
    -46.815 / 3600 * (Math.PI / 180),
    -59e-5 / 3600 * (Math.PI / 180),
    1813e-6 / 3600 * (Math.PI / 180)
  );
}
function meanObliquityLaskar(jde) {
  return base_default.horner(
    base_default.J2000Century(jde) * 0.01,
    new sexagesimal_default.Angle(false, 23, 26, 21.448).rad(),
    -4680.93 / 3600 * (Math.PI / 180),
    -1.55 / 3600 * (Math.PI / 180),
    1999.25 / 3600 * (Math.PI / 180),
    -51.38 / 3600 * (Math.PI / 180),
    -249.67 / 3600 * (Math.PI / 180),
    -39.05 / 3600 * (Math.PI / 180),
    7.12 / 3600 * (Math.PI / 180),
    27.87 / 3600 * (Math.PI / 180),
    5.79 / 3600 * (Math.PI / 180),
    2.45 / 3600 * (Math.PI / 180)
  );
}
function nutationInRA(jde) {
  const [\u0394\u03C8, \u0394\u03B5] = nutation(jde);
  const \u03B50 = meanObliquity(jde);
  return \u0394\u03C8 * Math.cos(\u03B50 + \u0394\u03B5);
}
var table22A = (function() {
  const PROPS = "d,m,n,f,\u03C9,s0,s1,c0,c1".split(",");
  const tab = [
    [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
    [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
    [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
    [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
    [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
    [0, 0, 1, 0, 0, 712, 0.1, -7, 0],
    [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
    [0, 0, 0, 2, 1, -386, -0.4, 200, 0],
    [0, 0, 1, 2, 2, -301, 0, 129, -0.1],
    [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
    [-2, 0, 1, 0, 0, -158, 0, 0, 0],
    [-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
    [0, 0, -1, 2, 2, 123, 0, -53, 0],
    [2, 0, 0, 0, 0, 63, 0, 0, 0],
    [0, 0, 1, 0, 1, 63, 0.1, -33, 0],
    [2, 0, -1, 2, 2, -59, 0, 26, 0],
    [0, 0, -1, 0, 1, -58, -0.1, 32, 0],
    [0, 0, 1, 2, 1, -51, 0, 27, 0],
    [-2, 0, 2, 0, 0, 48, 0, 0, 0],
    [0, 0, -2, 2, 1, 46, 0, -24, 0],
    [2, 0, 0, 2, 2, -38, 0, 16, 0],
    [0, 0, 2, 2, 2, -31, 0, 13, 0],
    [0, 0, 2, 0, 0, 29, 0, 0, 0],
    [-2, 0, 1, 2, 2, 29, 0, -12, 0],
    [0, 0, 0, 2, 0, 26, 0, 0, 0],
    [-2, 0, 0, 2, 0, -22, 0, 0, 0],
    [0, 0, -1, 2, 1, 21, 0, -10, 0],
    [0, 2, 0, 0, 0, 17, -0.1, 0, 0],
    [2, 0, -1, 0, 1, 16, 0, -8, 0],
    [-2, 2, 0, 2, 2, -16, 0.1, 7, 0],
    [0, 1, 0, 0, 1, -15, 0, 9, 0],
    [-2, 0, 1, 0, 1, -13, 0, 7, 0],
    [0, -1, 0, 0, 1, -12, 0, 6, 0],
    [0, 0, 2, -2, 0, 11, 0, 0, 0],
    [2, 0, -1, 2, 1, -10, 0, 5, 0],
    [2, 0, 1, 2, 2, -8, 0, 3, 0],
    [0, 1, 0, 2, 2, 7, 0, -3, 0],
    [-2, 1, 1, 0, 0, -7, 0, 0, 0],
    [0, -1, 0, 2, 2, -7, 0, 3, 0],
    [2, 0, 0, 2, 1, -7, 0, 3, 0],
    [2, 0, 1, 0, 0, 6, 0, 0, 0],
    [-2, 0, 2, 2, 2, 6, 0, -3, 0],
    [-2, 0, 1, 2, 1, 6, 0, -3, 0],
    [2, 0, -2, 0, 1, -6, 0, 3, 0],
    [2, 0, 0, 0, 1, -6, 0, 3, 0],
    [0, -1, 1, 0, 0, 5, 0, 0, 0],
    [-2, -1, 0, 2, 1, -5, 0, 3, 0],
    [-2, 0, 0, 0, 1, -5, 0, 3, 0],
    [0, 0, 2, 2, 1, -5, 0, 3, 0],
    [-2, 0, 2, 0, 1, 4, 0, 0, 0],
    [-2, 1, 0, 2, 1, 4, 0, 0, 0],
    [0, 0, 1, -2, 0, 4, 0, 0, 0],
    [-1, 0, 1, 0, 0, -4, 0, 0, 0],
    [-2, 1, 0, 0, 0, -4, 0, 0, 0],
    [1, 0, 0, 0, 0, -4, 0, 0, 0],
    [0, 0, 1, 2, 0, 3, 0, 0, 0],
    [0, 0, -2, 2, 2, -3, 0, 0, 0],
    [-1, -1, 1, 0, 0, -3, 0, 0, 0],
    [0, 1, 1, 0, 0, -3, 0, 0, 0],
    [0, -1, 1, 2, 2, -3, 0, 0, 0],
    [2, -1, -1, 2, 2, -3, 0, 0, 0],
    [0, 0, 3, 2, 2, -3, 0, 0, 0],
    [2, -1, 0, 2, 2, -3, 0, 0, 0]
  ];
  return tab.map((row) => {
    const o = {};
    PROPS.forEach((p3, i) => {
      o[p3] = row[i];
    });
    return o;
  });
})();
var nutation_default = {
  nutation,
  approxNutation,
  meanObliquity,
  meanObliquityLaskar,
  nutationInRA
};

// node_modules/astronomia/src/elementequinox.js
var Elements = class {
  constructor(inc, node2, peri) {
    if (typeof inc === "object") {
      node2 = inc.pode;
      peri = inc.peri;
      inc = inc.inc;
    }
    this.inc = inc || 0;
    this.node = node2 || 0;
    this.peri = peri || 0;
  }
};
var Lp = 4.50001688 * Math.PI / 180;
var L = 5.19856209 * Math.PI / 180;
var J = 651966e-8 * Math.PI / 180;

// node_modules/astronomia/src/precess.js
function approxAnnualPrecession(eqFrom, epochFrom, epochTo) {
  const [m3, na, nd] = mn(epochFrom, epochTo);
  const [sa, ca] = base_default.sincos(eqFrom.ra);
  const \u0394\u03B1s = m3 + na * sa * Math.tan(eqFrom.dec);
  const \u0394\u03B4s = nd * ca;
  const ra = new HourAngle(false, 0, 0, \u0394\u03B1s).rad();
  const dec = new Angle(false, 0, 0, \u0394\u03B4s).rad();
  return { ra, dec };
}
function mn(epochFrom, epochTo) {
  const T = (epochTo - epochFrom) * 0.01;
  const m3 = 3.07496 + 186e-5 * T;
  const na = 1.33621 - 57e-5 * T;
  const nd = 20.0431 - 85e-4 * T;
  return [m3, na, nd];
}
function approxPosition(eqFrom, epochFrom, epochTo, m\u03B1, m\u03B4) {
  const { ra, dec } = approxAnnualPrecession(eqFrom, epochFrom, epochTo);
  const dy = epochTo - epochFrom;
  const eqTo = new Equatorial();
  eqTo.ra = eqFrom.ra + (ra + m\u03B1) * dy;
  eqTo.dec = eqFrom.dec + (dec + m\u03B4) * dy;
  return eqTo;
}
var d = Math.PI / 180;
var s = d / 3600;
var \u03B6T = [2306.2181 * s, 1.39656 * s, -139e-6 * s];
var zT = [2306.2181 * s, 1.39656 * s, -139e-6 * s];
var \u03B8T = [2004.3109 * s, -0.8533 * s, -217e-6 * s];
var \u03B6t = [2306.2181 * s, 0.30188 * s, 0.017998 * s];
var zt = [2306.2181 * s, 1.09468 * s, 0.018203 * s];
var \u03B8t = [2004.3109 * s, -0.42665 * s, -0.041833 * s];
var Precessor = class {
  /**
   * constructs a Precessor object and initializes it to precess
   * coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor(epochFrom, epochTo) {
    let \u03B6Coeff = \u03B6t;
    let zCoeff = zt;
    let \u03B8Coeff = \u03B8t;
    if (epochFrom !== 2e3) {
      const T = (epochFrom - 2e3) * 0.01;
      \u03B6Coeff = [
        base_default.horner(T, ...\u03B6T),
        0.30188 * s - 344e-6 * s * T,
        0.017998 * s
      ];
      zCoeff = [
        base_default.horner(T, ...zT),
        1.09468 * s + 66e-6 * s * T,
        0.018203 * s
      ];
      \u03B8Coeff = [
        base_default.horner(T, ...\u03B8T),
        -0.42665 * s - 217e-6 * s * T,
        -0.041833 * s
      ];
    }
    const t = (epochTo - epochFrom) * 0.01;
    this.\u03B6 = base_default.horner(t, ...\u03B6Coeff) * t;
    this.z = base_default.horner(t, ...zCoeff) * t;
    const \u03B8 = base_default.horner(t, ...\u03B8Coeff) * t;
    this.s\u03B8 = Math.sin(\u03B8);
    this.c\u03B8 = Math.cos(\u03B8);
  }
  /**
   * Precess precesses coordinates eqFrom, leaving result in eqTo.
   *
   * @param {Equatorial} eqFrom
   * @returns {Equatorial} eqTo
   */
  precess(eqFrom) {
    const [s\u03B4, c\u03B4] = base_default.sincos(eqFrom.dec);
    const [s\u03B1\u03B6, c\u03B1\u03B6] = base_default.sincos(eqFrom.ra + this.\u03B6);
    const A = c\u03B4 * s\u03B1\u03B6;
    const B = this.c\u03B8 * c\u03B4 * c\u03B1\u03B6 - this.s\u03B8 * s\u03B4;
    const C = this.s\u03B8 * c\u03B4 * c\u03B1\u03B6 + this.c\u03B8 * s\u03B4;
    const eqTo = new Equatorial();
    eqTo.ra = Math.atan2(A, B) + this.z;
    if (C < base_default.CosSmallAngle) {
      eqTo.dec = Math.asin(C);
    } else {
      eqTo.dec = Math.acos(Math.hypot(A, B));
    }
    return eqTo;
  }
};
function position(eqFrom, epochFrom, epochTo, m\u03B1, m\u03B4) {
  const p3 = new Precessor(epochFrom, epochTo);
  const t = epochTo - epochFrom;
  const eqTo = new Equatorial();
  eqTo.ra = eqFrom.ra + m\u03B1 * t;
  eqTo.dec = eqFrom.dec + m\u03B4 * t;
  return p3.precess(eqTo);
}
var \u03B7T = [47.0029 * s, -0.06603 * s, 598e-6 * s];
var \u03C0T = [174.876384 * d, 3289.4789 * s, 0.60622 * s];
var pT = [5029.0966 * s, 2.22226 * s, -42e-6 * s];
var \u03B7t = [47.0029 * s, -0.03302 * s, 6e-5 * s];
var \u03C0t = [174.876384 * d, -869.8089 * s, 0.03536 * s];
var pt = [5029.0966 * s, 1.11113 * s, -6e-6 * s];
var EclipticPrecessor = class {
  /**
   * constructs an EclipticPrecessor object and initializes
   * it to precess coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor(epochFrom, epochTo) {
    let \u03B7Coeff = \u03B7t;
    let \u03C0Coeff = \u03C0t;
    let pCoeff = pt;
    if (epochFrom !== 2e3) {
      const T = (epochFrom - 2e3) * 0.01;
      \u03B7Coeff = [
        base_default.horner(T, ...\u03B7T),
        -0.03302 * s + 598e-6 * s * T,
        6e-5 * s
      ];
      \u03C0Coeff = [
        base_default.horner(T, ...\u03C0T),
        -869.8089 * s - 0.50491 * s * T,
        0.03536 * s
      ];
      pCoeff = [
        base_default.horner(T, ...pT),
        1.11113 * s - 42e-6 * s * T,
        -6e-6 * s
      ];
    }
    const t = (epochTo - epochFrom) * 0.01;
    this.\u03C0 = base_default.horner(t, ...\u03C0Coeff);
    this.p = base_default.horner(t, ...pCoeff) * t;
    const \u03B7 = base_default.horner(t, ...\u03B7Coeff) * t;
    this.s\u03B7 = Math.sin(\u03B7);
    this.c\u03B7 = Math.cos(\u03B7);
  }
  /**
   * EclipticPrecess precesses coordinates eclFrom, leaving result in eclTo.
   *
   * The same struct may be used for eclFrom and eclTo.
   * EclTo is returned for convenience.
   * @param {Ecliptic} eclFrom
   * @returns {Ecliptic} [eclTo]
   */
  precess(eclFrom) {
    const [s\u03B2, c\u03B2] = base_default.sincos(eclFrom.lat);
    const [sd, cd] = base_default.sincos(this.\u03C0 - eclFrom.lon);
    const A = this.c\u03B7 * c\u03B2 * sd - this.s\u03B7 * s\u03B2;
    const B = c\u03B2 * cd;
    const C = this.c\u03B7 * s\u03B2 + this.s\u03B7 * c\u03B2 * sd;
    const eclTo = new Ecliptic(this.p + this.\u03C0 - Math.atan2(A, B));
    if (C < base_default.CosSmallAngle) {
      eclTo.lat = Math.asin(C);
    } else {
      eclTo.lat = Math.acos(Math.hypot(A, B));
    }
    return eclTo;
  }
  /**
   * ReduceElements reduces orbital elements of a solar system body from one
   * equinox to another.
   *
   * This function is described in chapter 24, but is located in this
   * package so it can be a method of EclipticPrecessor.
   *
   * @param {Elements} eFrom
   * @returns {Elements} eTo
   */
  reduceElements(eFrom) {
    const \u03C8 = this.\u03C0 + this.p;
    const [si, ci] = base_default.sincos(eFrom.inc);
    const [snp, cnp] = base_default.sincos(eFrom.node - this.\u03C0);
    const eTo = new Elements();
    eTo.inc = Math.acos(ci * this.c\u03B7 + si * this.s\u03B7 * cnp);
    eTo.node = Math.atan2(si * snp, this.c\u03B7 * si * cnp - this.s\u03B7 * ci) + \u03C8;
    eTo.peri = Math.atan2(-this.s\u03B7 * snp, si * this.c\u03B7 - ci * this.s\u03B7 * cnp) + eFrom.peri;
    return eTo;
  }
};
function eclipticPosition(eclFrom, epochFrom, epochTo, m\u03B1, m\u03B4) {
  const p3 = new EclipticPrecessor(epochFrom, epochTo);
  if (m\u03B1 && m\u03B4 && (m\u03B1.rad() !== 0 || m\u03B4.rad() !== 0)) {
    const { lon, lat } = properMotion(m\u03B1.rad(), m\u03B4.rad(), epochFrom, eclFrom);
    const t = epochTo - epochFrom;
    eclFrom.lon += lon * t;
    eclFrom.lat += lat * t;
  }
  return p3.precess(eclFrom);
}
function properMotion(m\u03B1, m\u03B4, epoch3, ecl) {
  const \u03B5 = nutation_default.meanObliquity(base_default.JulianYearToJDE(epoch3));
  const [\u03B5sin, \u03B5cos] = base_default.sincos(\u03B5);
  const { ra, dec } = ecl.toEquatorial(\u03B5);
  const [s\u03B1, c\u03B1] = base_default.sincos(ra);
  const [s\u03B4, c\u03B4] = base_default.sincos(dec);
  const c\u03B2 = Math.cos(ecl.lat);
  const lon = (m\u03B4 * \u03B5sin * c\u03B1 + m\u03B1 * c\u03B4 * (\u03B5cos * c\u03B4 + \u03B5sin * s\u03B4 * s\u03B1)) / (c\u03B2 * c\u03B2);
  const lat = (m\u03B4 * (\u03B5cos * c\u03B4 + \u03B5sin * s\u03B4 * s\u03B1) - m\u03B1 * \u03B5sin * c\u03B1 * c\u03B4) / c\u03B2;
  return new Ecliptic(lon, lat);
}
function properMotion3D(eqFrom, epochFrom, epochTo, r, mr, m\u03B1, m\u03B4) {
  const [s\u03B1, c\u03B1] = base_default.sincos(eqFrom.ra);
  const [s\u03B4, c\u03B4] = base_default.sincos(eqFrom.dec);
  const x = r * c\u03B4 * c\u03B1;
  const y = r * c\u03B4 * s\u03B1;
  const z = r * s\u03B4;
  const mrr = mr / r;
  const zm\u03B4 = z * m\u03B4.rad();
  const mx = x * mrr - zm\u03B4 * c\u03B1 - y * m\u03B1.rad();
  const my = y * mrr - zm\u03B4 * s\u03B1 + x * m\u03B1.rad();
  const mz = z * mrr + r * m\u03B4.rad() * c\u03B4;
  const t = epochTo - epochFrom;
  const xp = x + t * mx;
  const yp = y + t * my;
  const zp = z + t * mz;
  const eqTo = new Equatorial();
  eqTo.ra = Math.atan2(yp, xp);
  eqTo.dec = Math.atan2(zp, Math.hypot(xp, yp));
  return eqTo;
}
var precess_default = {
  approxAnnualPrecession,
  mn,
  approxPosition,
  Precessor,
  position,
  EclipticPrecessor,
  eclipticPosition,
  properMotion,
  properMotion3D
};

// node_modules/astronomia/src/planetposition.js
function sum(t, series) {
  const coeffs = [];
  Object.keys(series).forEach((x) => {
    coeffs[x] = 0;
    let y = series[x].length - 1;
    for (y; y >= 0; y--) {
      const term = {
        a: series[x][y][0],
        b: series[x][y][1],
        c: series[x][y][2]
      };
      coeffs[x] += term.a * Math.cos(term.b + term.c * t);
    }
  });
  const res = base_default.horner(t, ...coeffs);
  return res;
}
var Planet = class {
  /**
   * VSOP87 representation of a Planet
   * @constructs Planet
   * @param {object} planet - planet data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia'
   * const earth = new planetposition.Planet(data.vsop87Bearth)
   * ```
   */
  constructor(planet) {
    if (typeof planet !== "object") throw new TypeError("need planet vsop87 data");
    this.name = planet.name;
    this.type = planet.type || "B";
    this.series = planet;
  }
  /**
   * Position2000 returns ecliptic position of planets by full VSOP87 theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position2000(jde) {
    const T = base_default.J2000Century(jde);
    const \u03C4 = T * 0.1;
    const lon = base_default.pmod(sum(\u03C4, this.series.L), 2 * Math.PI);
    const lat = sum(\u03C4, this.series.B);
    const range = sum(\u03C4, this.series.R);
    switch (this.type) {
      case "B":
        return new base_default.Coord(lon, lat, range);
      case "D": {
        const eclFrom = new coord_default.Ecliptic(lon, lat);
        const epochFrom = base_default.JDEToJulianYear(jde);
        const epochTo = 2e3;
        const eclTo = precess_default.eclipticPosition(eclFrom, epochFrom, epochTo);
        return new base_default.Coord(eclTo.lon, eclTo.lat, range);
      }
    }
  }
  /**
   * Position returns ecliptic position of planets at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are positions consistent with those from Meeus's
   * Apendix III, that is, at equinox and ecliptic of date.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position(jde) {
    const T = base_default.J2000Century(jde);
    const \u03C4 = T * 0.1;
    const lon = base_default.pmod(sum(\u03C4, this.series.L), 2 * Math.PI);
    const lat = sum(\u03C4, this.series.B);
    const range = sum(\u03C4, this.series.R);
    switch (this.type) {
      case "B": {
        const eclFrom = new coord_default.Ecliptic(lon, lat);
        const epochFrom = 2e3;
        const epochTo = base_default.JDEToJulianYear(jde);
        const eclTo = precess_default.eclipticPosition(eclFrom, epochFrom, epochTo);
        return new base_default.Coord(eclTo.lon, eclTo.lat, range);
      }
      case "D":
        return new base_default.Coord(lon, lat, range);
    }
  }
};
function toFK5(lon, lat, jde) {
  const T = base_default.J2000Century(jde);
  const Lp2 = lon - sexagesimal_default.angleFromDeg((1.397 + 31e-5 * T) * T);
  const [sLp, cLp] = base_default.sincos(Lp2);
  const L5 = lon + sexagesimal_default.angleFromSec(-0.09033 + 0.03916 * (cLp + sLp) * Math.tan(lat));
  const B5 = lat + sexagesimal_default.angleFromSec(0.03916 * (cLp - sLp));
  return new base_default.Coord(L5, B5);
}
var planetposition_default = {
  Planet,
  toFK5
};

// node_modules/astronomia/src/solar.js
function trueLongitude(T) {
  const L0 = base_default.horner(T, 280.46646, 36000.76983, 3032e-7) * Math.PI / 180;
  const m3 = meanAnomaly(T);
  const C = (base_default.horner(T, 1.914602, -4817e-6, -14e-6) * Math.sin(m3) + (0.019993 - 101e-6 * T) * Math.sin(2 * m3) + 289e-6 * Math.sin(3 * m3)) * Math.PI / 180;
  const lon = base_default.pmod(L0 + C, 2 * Math.PI);
  const ano = base_default.pmod(m3 + C, 2 * Math.PI);
  return { lon, ano };
}
function meanAnomaly(T) {
  return base_default.horner(T, 357.52911, 35999.05029, -1537e-7) * Math.PI / 180;
}
function eccentricity(T) {
  return base_default.horner(T, 0.016708634, -42037e-9, -1267e-10);
}
function radius(T) {
  const { lon, ano } = trueLongitude(T);
  const e = eccentricity(T);
  return 1.000001018 * (1 - e * e) / (1 + e * Math.cos(ano));
}
function apparentLongitude(T) {
  const \u03A9 = node(T);
  const { lon, ano } = trueLongitude(T);
  return lon - 569e-5 * Math.PI / 180 - 478e-5 * Math.PI / 180 * Math.sin(\u03A9);
}
function node(T) {
  return 125.04 * Math.PI / 180 - 1934.136 * Math.PI / 180 * T;
}
function true2000(T) {
  let { lon, ano } = trueLongitude(T);
  lon -= 0.01397 * Math.PI / 180 * T * 100;
  return { lon, ano };
}
function trueEquatorial(jde) {
  const { lon, ano } = trueLongitude(base_default.J2000Century(jde));
  const \u03B5 = nutation_default.meanObliquity(jde);
  const [ss, cs] = base_default.sincos(lon);
  const [s\u03B5, c\u03B5] = base_default.sincos(\u03B5);
  const ra = Math.atan2(c\u03B5 * ss, cs);
  const dec = s\u03B5 * ss;
  return new base_default.Coord(ra, dec);
}
function apparentEquatorial(jde) {
  const T = base_default.J2000Century(jde);
  const \u03BB = apparentLongitude(T);
  const \u03B5 = nutation_default.meanObliquity(jde);
  const [s\u03BB, c\u03BB] = base_default.sincos(\u03BB);
  const [s\u03B5, c\u03B5] = base_default.sincos(\u03B5 + 256e-5 * Math.PI / 180 * Math.cos(node(T)));
  const ra = Math.atan2(c\u03B5 * s\u03BB, c\u03BB);
  const dec = Math.asin(s\u03B5 * s\u03BB);
  return new base_default.Coord(ra, dec);
}
function trueVSOP87(planet, jde) {
  let { lon, lat, range } = planet.position(jde);
  const s2 = lon + Math.PI;
  const \u03BBp = base_default.horner(
    base_default.J2000Century(jde),
    s2,
    -1.397 * Math.PI / 180,
    -31e-5 * Math.PI / 180
  );
  const [s\u03BBp, c\u03BBp] = base_default.sincos(\u03BBp);
  const \u0394\u03B2 = 0.03916 / 3600 * Math.PI / 180 * (c\u03BBp - s\u03BBp);
  lon = base_default.pmod(s2 - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI);
  lat = \u0394\u03B2 - lat;
  return new base_default.Coord(lon, lat, range);
}
function apparentVSOP87(planet, jde) {
  let { lon, lat, range } = trueVSOP87(planet, jde);
  const \u0394\u03C8 = nutation_default.nutation(jde)[0];
  const a = aberration(range);
  lon = lon + \u0394\u03C8 + a;
  return new base_default.Coord(lon, lat, range);
}
function apparentEquatorialVSOP87(planet, jde) {
  const { lon, lat, range } = trueVSOP87(planet, jde);
  const [\u0394\u03C8, \u0394\u03B5] = nutation_default.nutation(jde);
  const a = aberration(range);
  const \u03BB = lon + \u0394\u03C8 + a;
  const \u03B5 = nutation_default.meanObliquity(jde) + \u0394\u03B5;
  const { ra, dec } = new coord_default.Ecliptic(\u03BB, lat).toEquatorial(\u03B5);
  return new Coord(ra, dec, range);
}
function aberration(range) {
  return -20.4898 / 3600 * Math.PI / 180 / range;
}
var solar_default = {
  trueLongitude,
  true: trueLongitude,
  // BACKWARDS-COMPATIBILITY
  meanAnomaly,
  eccentricity,
  radius,
  apparentLongitude,
  true2000,
  trueEquatorial,
  apparentEquatorial,
  trueVSOP87,
  apparentVSOP87,
  apparentEquatorialVSOP87,
  aberration
};

// node_modules/astronomia/src/apparent.js
var { cos: cos2, tan: tan2 } = Math;
var \u03BA = 20.49552 * Math.PI / 180 / 3600;

// node_modules/astronomia/src/apsis.js
var { sin: sin2, cos: cos3 } = Math;
var ck = 1 / 1325.55;
var D2R = Math.PI / 180;

// node_modules/astronomia/src/binary.js
var { atan, atan2: atan22, cos: cos4, sqrt: sqrt2, tan: tan3 } = Math;

// node_modules/astronomia/data/deltat.js
var m = {
  historic: {
    table: [44, 43, 43, 41, 40, 39, 38, 37, 37, 36, 36, 36, 37, 37, 38, 37, 36, 36, 35, 35, 34, 33, 33, 32, 32, 31, 31, 30, 30, 29, 29, 29, 29, 29, 28, 28, 27, 27, 26, 26, 25, 25, 25, 26, 26, 26, 26, 25, 25, 25, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23, 23, 23, 23, 22, 22, 22, 22, 22, 21, 21, 21, 21, 21, 21, 21, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 20, 20, 20, 20, 20, 19, 19, 19, 19, 19, 20, 20, 20, 20, 19, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21.1, 21, 21, 21, 20.9, 20.8, 20.7, 20.6, 20.4, 20.2, 20, 19.7, 19.4, 19.1, 18.7, 18.3, 17.8, 17.4, 17, 16.8, 16.6, 16.4, 16.1, 15.9, 15.7, 15.5, 15.3, 15, 14.7, 14.5, 14.3, 14.2, 14.1, 14.1, 14.1, 13.9, 13.7, 13.6, 13.5, 13.5, 13.5, 13.5, 13.4, 13.4, 13.4, 13.4, 13.3, 13.3, 13.2, 13.2, 13.2, 13.1, 13.1, 13.1, 13, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14, 14, 14.1, 14.1, 14.1, 14.1, 14.2, 14.3, 14.4, 14.4, 14.5, 14.6, 14.6, 14.7, 14.7, 14.7, 14.8, 14.8, 14.9, 14.9, 15, 15, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.6, 15.6, 15.8, 15.9, 15.9, 15.9, 15.8, 15.7, 15.8, 15.7, 15.7, 15.7, 15.8, 15.9, 16.1, 16.1, 16, 15.9, 15.9, 15.7, 15.4, 15.3, 15.4, 15.5, 15.6, 15.6, 15.6, 15.6, 15.6, 15.6, 15.6, 15.5, 15.5, 15.4, 15.3, 15.2, 15.1, 14.9, 14.8, 14.6, 14.4, 14.3, 14.2, 14.1, 14.2, 14.2, 13.9, 13.7, 13.5, 13.3, 13.1, 13, 13.2, 13.2, 13.1, 13.1, 13.2, 13.3, 13.5, 13.5, 13.4, 13.2, 13.2, 13.1, 13.1, 13, 12.8, 12.6, 12.7, 12.6, 12.3, 12, 11.9, 11.8, 11.6, 11.4, 11.2, 11.1, 11.1, 11.1, 11.1, 11.1, 11.2, 11.1, 11.1, 11.2, 11.4, 11.5, 11.3, 11.2, 11.4, 11.7, 11.9, 11.9, 11.9, 11.8, 11.7, 11.8, 11.8, 11.8, 11.7, 11.6, 11.6, 11.5, 11.5, 11.4, 11.4, 11.3, 11.3, 11.13, 11.16, 10.94, 10.72, 10.29, 10.04, 9.94, 9.91, 9.88, 9.86, 9.72, 9.67, 9.66, 9.64, 9.51, 9.4, 9.21, 9, 8.6, 8.29, 7.95, 7.73, 7.59, 7.49, 7.36, 7.26, 7.1, 7, 6.89, 6.82, 6.73, 6.64, 6.39, 6.28, 6.25, 6.27, 6.25, 6.27, 6.22, 6.24, 6.22, 6.27, 6.3, 6.36, 6.35, 6.37, 6.32, 6.33, 6.33, 6.37, 6.37, 6.41, 6.4, 6.44, 6.46, 6.51, 6.48, 6.51, 6.53, 6.58, 6.55, 6.61, 6.69, 6.8, 6.84, 6.94, 7.03, 7.13, 7.15, 7.22, 7.26, 7.3, 7.23, 7.22, 7.21, 7.2, 6.99, 6.98, 7.19, 7.36, 7.35, 7.39, 7.41, 7.45, 7.36, 7.18, 6.95, 6.72, 6.45, 6.24, 5.92, 5.59, 5.15, 4.67, 4.11, 3.52, 2.94, 2.47, 1.97, 1.52, 1.04, 0.6, 0.11, -0.34, -0.82, -1.25, -1.7, -2.08, -2.48, -2.82, -3.19, -3.5, -3.84, -4.14, -4.43, -4.59, -4.79, -4.92, -5.09, -5.24, -5.36, -5.34, -5.37, -5.32, -5.34, -5.33, -5.4, -5.47, -5.58, -5.66, -5.74, -5.68, -5.69, -5.65, -5.67, -5.68, -5.73, -5.72, -5.78, -5.79, -5.86, -5.89, -6.01, -6.13, -6.28, -6.41, -6.53, -6.49, -6.5, -6.45, -6.41, -6.26, -6.11, -5.9, -5.63, -5.13, -4.68, -4.19, -3.72, -3.21, -2.7, -2.09, -1.48, -0.75, -0.08, 0.62, 1.26, 1.95, 2.59, 3.28, 3.92, 4.61, 5.2, 5.73, 6.29, 7, 7.68, 8.45, 9.13, 9.78, 10.38, 10.99, 11.64, 12.47, 13.23, 14, 14.69, 15.38, 16, 16.64, 17.19, 17.72, 18.19, 18.67, 19.13, 19.69, 20.14, 20.54, 20.86, 21.14, 21.41, 21.78, 22.06, 22.3, 22.51, 22.79, 23.01, 23.29, 23.46, 23.55, 23.63, 23.8, 23.95, 24.25, 24.39, 24.42, 24.34, 24.22, 24.1, 24.08, 24.02, 24.04, 23.98, 23.91, 23.89, 23.95, 23.93, 23.92, 23.88, 23.94, 23.91, 23.82, 23.76, 23.87, 23.91, 23.95, 23.96, 24, 24.04, 24.2, 24.35, 24.61, 24.82, 25.09, 25.3, 25.56, 25.77, 26.05, 26.27, 26.54, 26.76, 27.04, 27.27, 27.55, 27.77, 28.03, 28.25, 28.5, 28.7, 28.95, 29.15, 29.38, 29.57, 29.8, 29.97, 30.19, 30.36, 30.57, 30.72, 30.93, 31.07, 31.24, 31.349, 31.516, 31.677, 31.923, 32.166, 32.449, 32.671, 32.919, 33.15, 33.397, 33.584, 33.804, 33.992, 34.24, 34.466, 34.731, 35.03, 35.4, 35.738, 36.147, 36.546, 36.995, 37.429, 37.879, 38.291, 38.753, 39.204, 39.707, 40.182, 40.706, 41.17, 41.686, 42.227, 42.825, 43.373, 43.959, 44.486, 44.997, 45.477, 45.983, 46.458, 46.997, 47.521, 48.034, 48.535, 49.099, 49.589, 50.102, 50.54, 50.975, 51.382, 51.81, 52.168, 52.572, 52.957, 53.434, 53.789, 54.087],
    first: 1657,
    last: 1984.5
  },
  data: {
    table: [43.4724372, 43.5648351, 43.6736863, 43.7782156, 43.8763273, 43.9562443, 44.0314956, 44.1131788, 44.1982187, 44.2951747, 44.3936471, 44.4840562, 44.5646335, 44.6425099, 44.7385767, 44.8370135, 44.9302138, 44.9986146, 45.0583549, 45.1283911, 45.2063835, 45.2980068, 45.3897017, 45.476138, 45.5632485, 45.6450189, 45.7374593, 45.8283721, 45.9132976, 45.9819705, 46.0407484, 46.1067084, 46.1825041, 46.2788561, 46.3713351, 46.4567207, 46.544486, 46.6310899, 46.7302231, 46.8283588, 46.9247443, 46.9969757, 47.0709148, 47.1450515, 47.2361542, 47.3413241, 47.4319364, 47.5213815, 47.6049313, 47.6837388, 47.7781381, 47.8770756, 47.9687104, 48.0348257, 48.0942021, 48.1608205, 48.2460028, 48.3438529, 48.4355405, 48.5344163, 48.6324506, 48.7293718, 48.8365414, 48.9353232, 49.0318781, 49.1013205, 49.1590844, 49.2285534, 49.3069683, 49.4017939, 49.4945263, 49.5861495, 49.6804907, 49.7602264, 49.8555805, 49.9489224, 50.0346777, 50.1018531, 50.1621723, 50.2260014, 50.2967905, 50.3831254, 50.4598772, 50.5387068, 50.6160484, 50.6865941, 50.7658362, 50.8453698, 50.918672, 50.9761148, 51.0278017, 51.084323, 51.1537928, 51.2318645, 51.306308, 51.3807849, 51.4526292, 51.5160394, 51.5985479, 51.680924, 51.7572854, 51.8133335, 51.8532385, 51.9014358, 51.9603433, 52.0328072, 52.0984957, 52.1667826, 52.2316418, 52.2938376, 52.3679897, 52.4465221, 52.5179552, 52.5751485, 52.6178012, 52.666816, 52.7340036, 52.8055792, 52.8792189, 52.9564838, 53.0444971, 53.126769, 53.2196749, 53.3024139, 53.3746645, 53.4335399, 53.4778015, 53.5299937, 53.5845392, 53.6522628, 53.7255844, 53.7882418, 53.8366625, 53.8829665, 53.9442904, 54.0042478, 54.0536342, 54.085644, 54.1084122, 54.1462942, 54.1913988, 54.2452023, 54.2957622, 54.3427024, 54.3910864, 54.4319877, 54.4897699, 54.545636, 54.597741, 54.6354962, 54.6532352, 54.677594, 54.7173643, 54.7740957, 54.8253023, 54.8712512, 54.916146, 54.9580535, 54.9997186, 55.047571, 55.0911778, 55.1132386, 55.132774, 55.1532423, 55.1898003, 55.2415531, 55.283803, 55.3222105, 55.3612676, 55.406262, 55.4628719, 55.5110909, 55.5523777, 55.5811877, 55.6004372, 55.626202, 55.6656271, 55.7167999, 55.7698097, 55.8196609, 55.8615028, 55.9129883, 55.9663474, 56.0220102, 56.0700015, 56.0939035, 56.110463, 56.1313736, 56.1610839, 56.2068432, 56.2582503, 56.3000349, 56.339902, 56.3789995, 56.4282839, 56.4803947, 56.5352164, 56.5697487, 56.5983102, 56.6328326, 56.6738814, 56.7332116, 56.7971596, 56.8552701, 56.9111378, 56.9754725, 57.0470772, 57.1136128, 57.173831, 57.2226068, 57.259731, 57.3072742, 57.3643368, 57.4334281, 57.5015747, 57.5653127, 57.6333396, 57.6972844, 57.7710774, 57.8407427, 57.9057801, 57.9575663, 57.9974929, 58.0425517, 58.1043319, 58.1679128, 58.2389092, 58.3091659, 58.3833021, 58.4536748, 58.5401438, 58.6227714, 58.6916662, 58.7409628, 58.7836189, 58.8405543, 58.898579, 58.9713678, 59.043837, 59.1218414, 59.2002687, 59.274737, 59.3574134, 59.4433827, 59.5242416, 59.5849787, 59.6343497, 59.6927827, 59.758805, 59.8386448, 59.9110567, 59.9844537, 60.056435, 60.123065, 60.2042185, 60.2803745, 60.3530352, 60.4011891, 60.4439959, 60.4900257, 60.5578054, 60.6324446, 60.7058569, 60.7853482, 60.8663504, 60.9386672, 61.0276757, 61.1103448, 61.1870458, 61.2453891, 61.2881024, 61.3377799, 61.4036165, 61.4760366, 61.5524599, 61.6286593, 61.6845819, 61.743306, 61.8132425, 61.8823203, 61.9496762, 61.9968743, 62.0342938, 62.0714108, 62.1202315, 62.1809508, 62.2382046, 62.2950486, 62.3506479, 62.3995381, 62.475395, 62.5463091, 62.6136031, 62.6570739, 62.6941742, 62.7383271, 62.7926305, 62.8566986, 62.9145607, 62.9658689, 63.0216632, 63.0807052, 63.1461718, 63.2052946, 63.2599441, 63.2844088, 63.2961369, 63.3126092, 63.3421622, 63.3871303, 63.4339302, 63.4673369, 63.4978642, 63.5319327, 63.5679441, 63.6104432, 63.6444291, 63.6641815, 63.6739403, 63.692603, 63.7147066, 63.7518055, 63.792717, 63.8285221, 63.8556871, 63.8803854, 63.9075025, 63.9392787, 63.9690744, 63.9798604, 63.9833077, 63.9938011, 64.0093384, 64.0399621, 64.0670429, 64.0907881, 64.1068077, 64.1282125, 64.1584211, 64.1832722, 64.2093975, 64.2116628, 64.2073173, 64.2115565, 64.2222858, 64.2499625, 64.2760973, 64.2998037, 64.3191858, 64.345013, 64.3734584, 64.3943291, 64.4151156, 64.4132064, 64.4118464, 64.4096536, 64.4167832, 64.43292, 64.4510529, 64.4734276, 64.4893377, 64.5053342, 64.5269189, 64.5470942, 64.5596729, 64.5512293, 64.5370906, 64.5359472, 64.5414947, 64.5543634, 64.5654298, 64.5736111, 64.5891142, 64.6014759, 64.6176147, 64.6374397, 64.6548674, 64.6530021, 64.6379271, 64.637161, 64.6399614, 64.6543152, 64.6723164, 64.6876311, 64.7051905, 64.7313433, 64.7575312, 64.7811143, 64.8000929, 64.7994561, 64.7876424, 64.783095, 64.7920604, 64.8096421, 64.8310888, 64.8451826, 64.8597013, 64.8849929, 64.9174991, 64.9480298, 64.9793881, 64.9894772, 65.0028155, 65.0138193, 65.0371432, 65.0772597, 65.112197, 65.1464034, 65.1832638, 65.2145358, 65.2493713, 65.2920645, 65.3279403, 65.3413366, 65.3451881, 65.34964, 65.3711307, 65.3971998, 65.4295547, 65.4573487, 65.486752, 65.5152012, 65.5449916, 65.5780768, 65.612728, 65.6287505, 65.6370091, 65.6493375, 65.6759928, 65.7096966, 65.746092, 65.7768362, 65.8024614, 65.8236695, 65.8595036, 65.8973008, 65.932291, 65.950911, 65.9534105, 65.962833, 65.9838647, 66.0146733, 66.042049, 66.0699217, 66.0961343, 66.1310116, 66.1682713, 66.2071627, 66.2355846, 66.2408549, 66.2335423, 66.2349107, 66.2441095, 66.2751123, 66.3054334, 66.3245568, 66.3405713, 66.3624433, 66.3957101, 66.428903, 66.4618675, 66.4748837, 66.4751281, 66.4828678, 66.5056165, 66.5382912, 66.5705628, 66.6030198, 66.6339689, 66.6569117, 66.6925011, 66.7288729, 66.7578719, 66.7707625, 66.7740427, 66.7846288, 66.810324, 66.840048, 66.8778601, 66.9069091, 66.944259, 66.9762508, 67.0258126, 67.0716286, 67.1100184, 67.1266401, 67.1331391, 67.145797, 67.17174, 67.2091069, 67.2459812, 67.2810383, 67.3136452, 67.3456968, 67.389003, 67.4318433, 67.4666209, 67.4858459, 67.4989147, 67.5110936, 67.5352658, 67.571103, 67.6070253, 67.6439167, 67.6765272, 67.7116693, 67.7590634, 67.8011542, 67.840213, 67.8606318, 67.8821576, 67.9120101, 67.9546462, 68.0054839, 68.051412, 68.1024205, 68.1577127, 68.2043653, 68.2664507, 68.3188171, 68.3703564, 68.3964356, 68.4094472, 68.4304611, 68.4629791, 68.507818, 68.5537018, 68.5927179, 68.6298107, 68.6670627, 68.7135208, 68.7622755, 68.8032843, 68.8244838, 68.8373427, 68.847693, 68.8688567, 68.9005814, 68.9354999, 68.9676423, 68.9875354, 69.0175527, 69.0499081, 69.0823433, 69.1070034, 69.1134027, 69.1141898, 69.1207203, 69.1355578, 69.16459, 69.1964228, 69.2201632, 69.2451564, 69.2732758, 69.3031979, 69.3325675, 69.3540507, 69.3581722, 69.3441594, 69.3376329, 69.3377424, 69.3432191, 69.3540144, 69.3611554, 69.3751703, 69.3889904, 69.4091639, 69.4264662, 69.4386335, 69.4241335, 69.3921241, 69.3693422, 69.3574782, 69.3593242, 69.3630244, 69.359334, 69.3510133, 69.3537917, 69.3582217, 69.367306, 69.3678649, 69.3514228, 69.3273414, 69.3033273, 69.2892463, 69.2880419, 69.2908014, 69.2944974, 69.2913953, 69.286149, 69.2835153, 69.2815422, 69.2806375, 69.2553511, 69.2125426, 69.1847287, 69.17207, 69.1691531, 69.173303, 69.1698064, 69.1589095, 69.1556275, 69.1672253, 69.1771384],
    first: 1973.0849315068492,
    firstYM: [1973, 2],
    last: 2023.3287671232877,
    lastYM: [2023, 5]
  },
  prediction: {
    table: [67.87818, 67.96817999999999, 68.02817999999999, 68.04818, 68.12818, 68.21817999999999, 68.26818, 68.28818, 68.36818, 68.44818, 68.50818, 68.51818, 68.59818, 68.68818, 68.73818, 68.74817999999999, 68.82818, 68.91817999999999, 68.96817999999999, 68.98818, 69.06818, 69.14818, 69.20818, 69.22818, 69.30818, 69.39818, 69.46817999999999, 69.48818, 69.57818, 69.66817999999999, 69.73818, 69.75818, 69.85817999999999, 69.95818, 70.02817999999999, 70.05818, 70.15818, 70.25818, 70.33818, 70.36818, 70.46817999999999],
    first: 2022,
    last: 2032
  }
};
var deltat_default = m;

// node_modules/astronomia/src/deltat.js
function LeapYearGregorian(y) {
  return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
}
function deltaT(dyear) {
  let \u0394T;
  if (dyear < -500) {
    \u0394T = base_default.horner((dyear - 1820) * 0.01, -20, 0, 32);
  } else if (dyear < 500) {
    \u0394T = base_default.horner(
      dyear * 0.01,
      10583.6,
      -1014.41,
      33.78311,
      -5.952053,
      -0.1798452,
      0.022174192,
      0.0090316521
    );
  } else if (dyear < 1600) {
    \u0394T = base_default.horner(
      (dyear - 1e3) * 0.01,
      1574.2,
      -556.01,
      71.23472,
      0.319781,
      -0.8503463,
      -5050998e-9,
      0.0083572073
    );
  } else if (dyear < deltat_default.historic.first) {
    \u0394T = base_default.horner(dyear - 1600, 120, -0.9808, -0.01532, 1 / 7129);
  } else if (dyear < deltat_default.data.first) {
    \u0394T = interpolate(dyear, deltat_default.historic);
  } else if (dyear < deltat_default.data.last - 0.25) {
    \u0394T = interpolateData(dyear, deltat_default.data);
  } else if (dyear < deltat_default.prediction.last) {
    \u0394T = interpolate(dyear, deltat_default.prediction);
  } else if (dyear < 2050) {
    \u0394T = base_default.horner((dyear - 2e3) / 100, 62.92, 32.217, 55.89);
  } else if (dyear < 2150) {
    \u0394T = base_default.horner((dyear - 1820) / 100, -205.72, 56.28, 32);
  } else {
    const u = (dyear - 1820) / 100;
    \u0394T = -20 + 32 * u * u;
  }
  return \u0394T;
}
function interpolate(dyear, data) {
  const d3 = interpolation_default.len3ForInterpolateX(
    dyear,
    data.first,
    data.last,
    data.table
  );
  return d3.interpolateX(dyear);
}
function interpolateData(dyear, data) {
  const [fyear, fmonth] = data.firstYM;
  const { year, month, first: first2, last: last2 } = monthOfYear(dyear);
  const pos = 12 * (year - fyear) + (month - fmonth);
  const table = data.table.slice(pos, pos + 3);
  const d3 = new interpolation_default.Len3(first2, last2, table);
  return d3.interpolateX(dyear);
}
function monthOfYear(dyear) {
  const year = dyear | 0;
  const f = dyear - year;
  const d3 = LeapYearGregorian(year) ? 1 : 0;
  const data = monthOfYear.data[d3];
  let month = 12;
  while (month > 0 && data[month] > f) {
    month--;
  }
  const first2 = year + data[month];
  const last2 = month < 11 ? year + data[month + 2] : year + 1 + data[(month + 2) % 12];
  return { year, month, first: first2, last: last2 };
}
monthOfYear.data = [
  [
    // non leap year
    0,
    0,
    0.08493150684921602,
    0.16164383561635987,
    0.24657534246580326,
    0.3287671232876619,
    0.4136986301368779,
    0.4958904109589639,
    0.5808219178081799,
    0.6657534246576233,
    0.747945205479482,
    0.832876712328698,
    0.915068493150784
  ],
  [
    // leap year
    0,
    0,
    0.08743169398917416,
    0.1639344262296163,
    0.24863387978143692,
    0.3306010928961314,
    0.4153005464481794,
    0.49726775956287383,
    0.5819672131146945,
    0.6666666666667425,
    0.7486338797814369,
    0.8333333333332575,
    0.9153005464481794
  ]
];
var deltat_default2 = {
  deltaT
};

// node_modules/astronomia/src/moonphase.js
var { sin: sin3, cos: cos5 } = Math;
var ck2 = 1 / 1236.85;
var D2R2 = Math.PI / 180;
var meanLunarMonth = 29.530588861;
function mean(T) {
  return base_default.horner(
    T,
    245155009766e-5,
    29.530588861 / ck2,
    15437e-8,
    -15e-8,
    73e-11
  );
}
function snap(y, q) {
  const k = (y - 2e3) * 12.3685;
  return Math.floor(k - q + 0.5) + q;
}
function meanNew(year) {
  return mean(snap(year, 0) * ck2);
}
function meanFirst(year) {
  return mean(snap(year, 0.25) * ck2);
}
function meanFull(year) {
  return mean(snap(year, 0.5) * ck2);
}
function meanLast(year) {
  return mean(snap(year, 0.75) * ck2);
}
function newMoon(year) {
  const m3 = new Mp(year, 0);
  return mean(m3.T) + m3.nfc(nc) + m3.a();
}
function first(year) {
  const m3 = new Mp(year, 0.25);
  return mean(m3.T) + m3.flc() + m3.w() + m3.a();
}
function full(year) {
  const m3 = new Mp(year, 0.5);
  return mean(m3.T) + m3.nfc(fc) + m3.a();
}
function last(year) {
  const m3 = new Mp(year, 0.75);
  return mean(m3.T) + m3.flc() - m3.w() + m3.a();
}
var Mp = class {
  constructor(y, q) {
    this.A = new Array(14);
    const k = this.k = snap(y, q);
    const T = this.T = this.k * ck2;
    this.E = base_default.horner(T, 1, -2516e-6, -74e-7);
    this.M = base_default.horner(
      T,
      2.5534 * D2R2,
      29.1053567 * D2R2 / ck2,
      -14e-7 * D2R2,
      -11e-8 * D2R2
    );
    this.M_ = base_default.horner(
      T,
      201.5643 * D2R2,
      385.81693528 * D2R2 / ck2,
      0.0107582 * D2R2,
      1238e-8 * D2R2,
      -58e-9 * D2R2
    );
    this.F = base_default.horner(
      T,
      160.7108 * D2R2,
      390.67050284 * D2R2 / ck2,
      -16118e-7 * D2R2,
      -227e-8 * D2R2,
      11e-9 * D2R2
    );
    this.\u03A9 = base_default.horner(
      T,
      124.7746 * D2R2,
      -1.56375588 * D2R2 / ck2,
      20672e-7 * D2R2,
      215e-8 * D2R2
    );
    this.A[0] = 299.7 * D2R2 + 0.107408 * D2R2 * k - 9173e-6 * T * T;
    this.A[1] = 251.88 * D2R2 + 0.016321 * D2R2 * k;
    this.A[2] = 251.83 * D2R2 + 26.651886 * D2R2 * k;
    this.A[3] = 349.42 * D2R2 + 36.412478 * D2R2 * k;
    this.A[4] = 84.66 * D2R2 + 18.206239 * D2R2 * k;
    this.A[5] = 141.74 * D2R2 + 53.303771 * D2R2 * k;
    this.A[6] = 207.17 * D2R2 + 2.453732 * D2R2 * k;
    this.A[7] = 154.84 * D2R2 + 7.30686 * D2R2 * k;
    this.A[8] = 34.52 * D2R2 + 27.261239 * D2R2 * k;
    this.A[9] = 207.19 * D2R2 + 0.121824 * D2R2 * k;
    this.A[10] = 291.34 * D2R2 + 1.844379 * D2R2 * k;
    this.A[11] = 161.72 * D2R2 + 24.198154 * D2R2 * k;
    this.A[12] = 239.56 * D2R2 + 25.513099 * D2R2 * k;
    this.A[13] = 331.55 * D2R2 + 3.592518 * D2R2 * k;
  }
  // new or full corrections
  nfc(c) {
    const { M, M_, E, F, \u03A9 } = this;
    return c[0] * sin3(M_) + c[1] * sin3(M) * E + c[2] * sin3(2 * M_) + c[3] * sin3(2 * F) + c[4] * sin3(M_ - M) * E + c[5] * sin3(M_ + M) * E + c[6] * sin3(2 * M) * E * E + c[7] * sin3(M_ - 2 * F) + c[8] * sin3(M_ + 2 * F) + c[9] * sin3(2 * M_ + M) * E + c[10] * sin3(3 * M_) + c[11] * sin3(M + 2 * F) * E + c[12] * sin3(M - 2 * F) * E + c[13] * sin3(2 * M_ - M) * E + c[14] * sin3(\u03A9) + c[15] * sin3(M_ + 2 * M) + c[16] * sin3(2 * (M_ - F)) + c[17] * sin3(3 * M) + c[18] * sin3(M_ + M - 2 * F) + c[19] * sin3(2 * (M_ + F)) + c[20] * sin3(M_ + M + 2 * F) + c[21] * sin3(M_ - M + 2 * F) + c[22] * sin3(M_ - M - 2 * F) + c[23] * sin3(3 * M_ + M) + c[24] * sin3(4 * M_);
  }
  // first or last corrections
  flc() {
    const { M, M_, E, F, \u03A9 } = this;
    return -0.62801 * sin3(M_) + 0.17172 * sin3(M) * E + -0.01183 * sin3(M_ + M) * E + 862e-5 * sin3(2 * M_) + 804e-5 * sin3(2 * F) + 454e-5 * sin3(M_ - M) * E + 204e-5 * sin3(2 * M) * E * E + -18e-4 * sin3(M_ - 2 * F) + -7e-4 * sin3(M_ + 2 * F) + -4e-4 * sin3(3 * M_) + -34e-5 * sin3(2 * M_ - M) * E + 32e-5 * sin3(M + 2 * F) * E + 32e-5 * sin3(M - 2 * F) * E + -28e-5 * sin3(M_ + 2 * M) * E * E + 27e-5 * sin3(2 * M_ + M) * E + -17e-5 * sin3(\u03A9) + -5e-5 * sin3(M_ - M - 2 * F) + 4e-5 * sin3(2 * M_ + 2 * F) + -4e-5 * sin3(M_ + M + 2 * F) + 4e-5 * sin3(M_ - 2 * M) + 3e-5 * sin3(M_ + M - 2 * F) + 3e-5 * sin3(3 * M) + 2e-5 * sin3(2 * M_ - 2 * F) + 2e-5 * sin3(M_ - M + 2 * F) + -2e-5 * sin3(3 * M_ + M);
  }
  w() {
    const { M, M_, E, F } = this;
    return 306e-5 - 38e-5 * E * cos5(M) + 26e-5 * cos5(M_) - 2e-5 * (cos5(M_ - M) - cos5(M_ + M) - cos5(2 * F));
  }
  // additional corrections
  a() {
    let a = 0;
    ac.forEach((c, i) => {
      a += c * sin3(this.A[i]);
    });
    return a;
  }
};
var nc = [
  -0.4072,
  0.17241,
  0.01608,
  0.01039,
  739e-5,
  -514e-5,
  208e-5,
  -111e-5,
  -57e-5,
  56e-5,
  -42e-5,
  42e-5,
  38e-5,
  -24e-5,
  -17e-5,
  -7e-5,
  4e-5,
  4e-5,
  3e-5,
  3e-5,
  -3e-5,
  3e-5,
  -2e-5,
  -2e-5,
  2e-5
];
var fc = [
  -0.40614,
  0.17302,
  0.01614,
  0.01043,
  734e-5,
  -515e-5,
  209e-5,
  -111e-5,
  -57e-5,
  56e-5,
  -42e-5,
  42e-5,
  38e-5,
  -24e-5,
  -17e-5,
  -7e-5,
  4e-5,
  4e-5,
  3e-5,
  3e-5,
  -3e-5,
  3e-5,
  -2e-5,
  -2e-5,
  2e-5
];
var ac = [
  325e-6,
  165e-6,
  164e-6,
  126e-6,
  11e-5,
  62e-6,
  6e-5,
  56e-6,
  47e-6,
  42e-6,
  4e-5,
  37e-6,
  35e-6,
  23e-6
];
var moonphase_default = {
  meanLunarMonth,
  meanNew,
  meanFirst,
  meanFull,
  meanLast,
  newMoon,
  new: newMoon,
  // BACKWARDS-COMPATIBILITY
  first,
  full,
  last
};

// node_modules/astronomia/src/elp.js
var SEC2RAD = 1 / 3600 * Math.PI / 180;

// node_modules/astronomia/src/eqtime.js
var { cos: cos6, sin: sin4, tan: tan4 } = Math;

// node_modules/astronomia/src/illum.js
var { toDeg: toDeg2 } = base_default;
var D2R3 = Math.PI / 180;

// node_modules/astronomia/src/julian.js
var int2 = Math.trunc;
var GREGORIAN0JD = 22991605e-1;
var DAYS_OF_YEAR = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
var SECS_OF_DAY = 86400;
var Calendar = class {
  /**
   * @param {number|Date} [year] - If `Date` is given then year, month, day is taken from that. Shortcut to `new Calendar().fromDate(date)`
   * @param {number} [month]
   * @param {number} [day]
   */
  constructor(year, month = 1, day = 1) {
    if (year instanceof Date) {
      this.fromDate(year);
    } else {
      this.year = year;
      this.month = month;
      this.day = day;
    }
  }
  getDate() {
    return {
      year: this.year,
      month: this.month,
      day: Math.floor(this.day)
    };
  }
  getTime() {
    const t = new sexagesimal_default.Time(this.day * SECS_OF_DAY);
    const [neg, h, m3, _s] = t.toHMS();
    let [s2, ms] = base_default.modf(_s);
    ms = Math.trunc(ms * 1e3);
    return {
      hour: h % 24,
      minute: m3,
      second: s2,
      millisecond: ms
    };
  }
  toISOString() {
    const { year, month, day } = this.getDate();
    const { hour, minute, second, millisecond } = this.getTime();
    return `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)}Z`;
  }
  isGregorian() {
    return isCalendarGregorian(this.year, this.month, this.day);
  }
  /**
   * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
   * proleptic Gregorian Calender
   * @param {Date} date - proleptic Gregorian date
   */
  fromDate(date) {
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const ms = date.getMilliseconds();
    this.day = day + (hour + (minute + (second + ms / 1e3) / 60) / 60) / 24;
    return this;
  }
  /**
   * Note: Take care for dates < GREGORIAN0JD as `date` is always within the
   * proleptic Gregorian Calender
   * @returns {Date} proleptic Gregorian date
   */
  toDate() {
    const [day, fhour] = base_default.modf(this.day);
    const [hour, fminute] = base_default.modf(fhour * 24);
    const [minute, fsecond] = base_default.modf(fminute * 60);
    const [second, fms] = base_default.modf(fsecond * 60);
    const date = new Date(Date.UTC(
      this.year,
      this.month - 1,
      day,
      hour,
      minute,
      second,
      Math.round(fms * 1e3)
    ));
    date.setUTCFullYear(this.year);
    return date;
  }
  /**
   * converts a calendar date to decimal year
   * @returns {number} decimal year
   */
  toYear() {
    const [d3, f] = base_default.modf(this.day);
    const n = this.dayOfYear() - 1 + f;
    const days = this.isLeapYear() ? 366 : 365;
    const decYear = this.year + n / days;
    return decYear;
  }
  /**
   * converts a decimal year to a calendar date
   * @param {number} year - decimal year
   */
  fromYear(year) {
    const [y, f] = base_default.modf(year);
    this.year = y;
    const days = this.isLeapYear() ? 366 : 365;
    const dayOfYear = base_default.round(f * days, 5);
    let m3 = 12;
    while (m3 > 0 && DAYS_OF_YEAR[m3] > dayOfYear) {
      m3--;
    }
    this.month = m3;
    this.day = 1 + dayOfYear - DAYS_OF_YEAR[this.month];
    return this;
  }
  isLeapYear() {
    if (this.isGregorian()) {
      return LeapYearGregorian2(this.year);
    } else {
      return LeapYearJulian(this.year);
    }
  }
  toJD() {
    return CalendarToJD(this.year, this.month, this.day, !this.isGregorian());
  }
  fromJD(jd) {
    const isJulian = !isJDCalendarGregorian(jd);
    const { year, month, day } = JDToCalendar(jd, isJulian);
    this.year = year;
    this.month = month;
    this.day = day;
    return this;
  }
  fromJDE(jde) {
    this.fromJD(jde);
    const dT = deltat_default2.deltaT(this.toYear());
    this.day -= dT / 86400;
    return this;
  }
  toJDE() {
    const dT = deltat_default2.deltaT(this.toYear());
    this.day += dT / 86400;
    return this.toJD();
  }
  /**
   * set date to midnight UTC
   */
  midnight() {
    this.day = Math.floor(this.day);
    return this;
  }
  /**
   * set date to noon UTC
   */
  noon() {
    this.day = Math.floor(this.day) + 0.5;
    return this;
  }
  /**
   * @param {Boolean} td - if `true` calendar instance is in TD; date gets converted to UT
   *   true  - `UT = TD - ΔT`
   *   false - `TD = UT + ΔT`
   */
  deltaT(td) {
    const dT = deltat_default2.deltaT(this.toYear());
    if (td) {
      this.day -= dT / 86400;
    } else {
      this.day += dT / 86400;
    }
    return this;
  }
  dayOfWeek() {
    return DayOfWeek(this.toJD());
  }
  dayOfYear() {
    if (this.isGregorian()) {
      return DayOfYearGregorian(this.year, this.month, this.day);
    } else {
      return DayOfYearJulian(this.year, this.month, this.day);
    }
  }
};
var CalendarJulian = class extends Calendar {
  toJD() {
    return CalendarJulianToJD(this.year, this.month, this.day);
  }
  fromJD(jd) {
    const { year, month, day } = JDToCalendarJulian(jd);
    this.year = year;
    this.month = month;
    this.day = day;
    return this;
  }
  isLeapYear() {
    return LeapYearJulian(this.year);
  }
  dayOfYear() {
    return DayOfYearJulian(this.year, this.month, this.day);
  }
  /**
   * toGregorian converts a Julian calendar date to a year, month, and day
   * in the Gregorian calendar.
   * @returns {CalendarGregorian}
   */
  toGregorian() {
    const jd = this.toJD();
    return new CalendarGregorian().fromJD(jd);
  }
};
var CalendarGregorian = class extends Calendar {
  toJD() {
    return CalendarGregorianToJD(this.year, this.month, this.day);
  }
  fromJD(jd) {
    const { year, month, day } = JDToCalendarGregorian(jd);
    this.year = year;
    this.month = month;
    this.day = day;
    return this;
  }
  isLeapYear() {
    return LeapYearGregorian2(this.year);
  }
  dayOfYear() {
    return DayOfYearGregorian(this.year, this.month, this.day);
  }
  /*
  * toJulian converts a Gregorian calendar date to a year, month, and day
  * in the Julian calendar.
  * @returns {CalendarJulian}
  */
  toJulian() {
    const jd = this.toJD();
    return new CalendarJulian().fromJD(jd);
  }
};
function CalendarToJD(y, m3, d3, isJulian) {
  let b = 0;
  if (m3 < 3) {
    y--;
    m3 += 12;
  }
  if (!isJulian) {
    const a = base_default.floorDiv(y, 100);
    b = 2 - a + base_default.floorDiv(a, 4);
  }
  const jd = base_default.floorDiv(36525 * int2(y + 4716), 100) + (base_default.floorDiv(306 * (m3 + 1), 10) + b) + d3 - 1524.5;
  return jd;
}
function CalendarGregorianToJD(y, m3, d3) {
  return CalendarToJD(y, m3, d3, false);
}
function CalendarJulianToJD(y, m3, d3) {
  return CalendarToJD(y, m3, d3, true);
}
function LeapYearJulian(y) {
  return y % 4 === 0;
}
function LeapYearGregorian2(y) {
  return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
}
function JDToCalendar(jd, isJulian) {
  const [z, f] = base_default.modf(jd + 0.5);
  let a = z;
  if (!isJulian) {
    const \u03B1 = base_default.floorDiv(z * 100 - 186721625, 3652425);
    a = z + 1 + \u03B1 - base_default.floorDiv(\u03B1, 4);
  }
  const b = a + 1524;
  const c = base_default.floorDiv(b * 100 - 12210, 36525);
  const d3 = base_default.floorDiv(36525 * c, 100);
  const e = int2(base_default.floorDiv((b - d3) * 1e4, 306001));
  let year;
  let month;
  const day = int2(b - d3) - base_default.floorDiv(306001 * e, 1e4) + f;
  if (e === 14 || e === 15) {
    month = e - 13;
  } else {
    month = e - 1;
  }
  if (month < 3) {
    year = int2(c) - 4715;
  } else {
    year = int2(c) - 4716;
  }
  return { year, month, day };
}
function JDToCalendarGregorian(jd) {
  return JDToCalendar(jd, false);
}
function JDToCalendarJulian(jd) {
  return JDToCalendar(jd, true);
}
function isJDCalendarGregorian(jd) {
  return jd >= GREGORIAN0JD;
}
function isCalendarGregorian(year, month = 1, day = 1) {
  return year > 1582 || year === 1582 && month > 10 || year === 1582 && month === 10 && day >= 15;
}
function JDToDate(jd) {
  return new CalendarGregorian().fromJD(jd).toDate();
}
function DateToJD(date) {
  return new CalendarGregorian().fromDate(date).toJD();
}
function JDEToDate(jde) {
  return new CalendarGregorian().fromJDE(jde).toDate();
}
function DateToJDE(date) {
  return new CalendarGregorian().fromDate(date).toJDE();
}
function MJDToJD(mjd) {
  return mjd + base_default.JMod;
}
function JDToMJD(jd) {
  return jd - base_default.JMod;
}
function DayOfWeek(jd) {
  return int2(jd + 1.5) % 7;
}
function DayOfYearGregorian(y, m3, d3) {
  return DayOfYear(y, m3, int2(d3), LeapYearGregorian2(y));
}
function DayOfYearJulian(y, m3, d3) {
  return DayOfYear(y, m3, int2(d3), LeapYearJulian(y));
}
function DayOfYear(y, m3, d3, leap) {
  let k = 0;
  if (leap && m3 > 1) {
    k = 1;
  }
  return k + DAYS_OF_YEAR[m3] + int2(d3);
}
function DayOfYearToCalendar(n, leap) {
  let month;
  let k = 0;
  if (leap) {
    k = 1;
  }
  for (month = 1; month <= 12; month++) {
    if (k + DAYS_OF_YEAR[month] > n) {
      month = month - 1;
      break;
    }
  }
  const day = n - k - DAYS_OF_YEAR[month];
  return { month, day };
}
function DayOfYearToCalendarGregorian(year, n) {
  const { month, day } = DayOfYearToCalendar(n, LeapYearGregorian2(year));
  return new CalendarGregorian(year, month, day);
}
function DayOfYearToCalendarJulian(year, n) {
  const { month, day } = DayOfYearToCalendar(n, LeapYearJulian(year));
  return new CalendarJulian(year, month, day);
}
function pad(num, len) {
  len = len || 2;
  const neg = num < 0 ? "-" : "";
  num = Math.abs(num);
  const padded = "0000" + num;
  return neg + padded.substr(padded.length - len, len);
}
var julian_default = {
  GREGORIAN0JD,
  Calendar,
  CalendarJulian,
  CalendarGregorian,
  CalendarToJD,
  CalendarGregorianToJD,
  CalendarJulianToJD,
  LeapYearJulian,
  LeapYearGregorian: LeapYearGregorian2,
  JDToCalendar,
  JDToCalendarGregorian,
  JDToCalendarJulian,
  isJDCalendarGregorian,
  isCalendarGregorian,
  JDToDate,
  DateToJD,
  JDEToDate,
  DateToJDE,
  MJDToJD,
  JDToMJD,
  DayOfWeek,
  DayOfYearGregorian,
  DayOfYearJulian,
  DayOfYear,
  DayOfYearToCalendar,
  DayOfYearToCalendarGregorian,
  DayOfYearToCalendarJulian
};

// node_modules/astronomia/src/moonposition.js
var { asin: asin2, sin: sin5 } = Math;
var D2R4 = Math.PI / 180;
var ta = (function() {
  const ta2 = [
    [0, 0, 1, 0, 6288774, -20905355],
    [2, 0, -1, 0, 1274027, -3699111],
    [2, 0, 0, 0, 658314, -2955968],
    [0, 0, 2, 0, 213618, -569925],
    [0, 1, 0, 0, -185116, 48888],
    [0, 0, 0, 2, -114332, -3149],
    [2, 0, -2, 0, 58793, 246158],
    [2, -1, -1, 0, 57066, -152138],
    [2, 0, 1, 0, 53322, -170733],
    [2, -1, 0, 0, 45758, -204586],
    [0, 1, -1, 0, -40923, -129620],
    [1, 0, 0, 0, -34720, 108743],
    [0, 1, 1, 0, -30383, 104755],
    [2, 0, 0, -2, 15327, 10321],
    [0, 0, 1, 2, -12528, 0],
    [0, 0, 1, -2, 10980, 79661],
    [4, 0, -1, 0, 10675, -34782],
    [0, 0, 3, 0, 10034, -23210],
    [4, 0, -2, 0, 8548, -21636],
    [2, 1, -1, 0, -7888, 24208],
    [2, 1, 0, 0, -6766, 30824],
    [1, 0, -1, 0, -5163, -8379],
    [1, 1, 0, 0, 4987, -16675],
    [2, -1, 1, 0, 4036, -12831],
    [2, 0, 2, 0, 3994, -10445],
    [4, 0, 0, 0, 3861, -11650],
    [2, 0, -3, 0, 3665, 14403],
    [0, 1, -2, 0, -2689, -7003],
    [2, 0, -1, 2, -2602, 0],
    [2, -1, -2, 0, 2390, 10056],
    [1, 0, 1, 0, -2348, 6322],
    [2, -2, 0, 0, 2236, -9884],
    [0, 1, 2, 0, -2120, 5751],
    [0, 2, 0, 0, -2069, 0],
    [2, -2, -1, 0, 2048, -4950],
    [2, 0, 1, -2, -1773, 4130],
    [2, 0, 0, 2, -1595, 0],
    [4, -1, -1, 0, 1215, -3958],
    [0, 0, 2, 2, -1110, 0],
    [3, 0, -1, 0, -892, 3258],
    [2, 1, 1, 0, -810, 2616],
    [4, -1, -2, 0, 759, -1897],
    [0, 2, -1, 0, -713, -2117],
    [2, 2, -1, 0, -700, 2354],
    [2, 1, -2, 0, 691, 0],
    [2, -1, 0, -2, 596, 0],
    [4, 0, 1, 0, 549, -1423],
    [0, 0, 4, 0, 537, -1117],
    [4, -1, 0, 0, 520, -1571],
    [1, 0, -2, 0, -487, -1739],
    [2, 1, 0, -2, -399, 0],
    [0, 0, 2, -2, -381, -4421],
    [1, 1, 1, 0, 351, 0],
    [3, 0, -2, 0, -340, 0],
    [4, 0, -3, 0, 330, 0],
    [2, -1, 2, 0, 327, 0],
    [0, 2, 1, 0, -323, 1165],
    [1, 1, -1, 0, 299, 0],
    [2, 0, 3, 0, 294, 0],
    [2, 0, -1, -2, 0, 8752]
  ];
  return ta2.map((row) => {
    const o = {};
    const vals = ["d", "m", "m_", "f", "\u03A3l", "\u03A3r"];
    vals.forEach((D2R10, i) => {
      o[D2R10] = row[i];
    });
    return o;
  });
})();
var tb = (function() {
  const tb2 = [
    [0, 0, 0, 1, 5128122],
    [0, 0, 1, 1, 280602],
    [0, 0, 1, -1, 277693],
    [2, 0, 0, -1, 173237],
    [2, 0, -1, 1, 55413],
    [2, 0, -1, -1, 46271],
    [2, 0, 0, 1, 32573],
    [0, 0, 2, 1, 17198],
    [2, 0, 1, -1, 9266],
    [0, 0, 2, -1, 8822],
    [2, -1, 0, -1, 8216],
    [2, 0, -2, -1, 4324],
    [2, 0, 1, 1, 4200],
    [2, 1, 0, -1, -3359],
    [2, -1, -1, 1, 2463],
    [2, -1, 0, 1, 2211],
    [2, -1, -1, -1, 2065],
    [0, 1, -1, -1, -1870],
    [4, 0, -1, -1, 1828],
    [0, 1, 0, 1, -1794],
    [0, 0, 0, 3, -1749],
    [0, 1, -1, 1, -1565],
    [1, 0, 0, 1, -1491],
    [0, 1, 1, 1, -1475],
    [0, 1, 1, -1, -1410],
    [0, 1, 0, -1, -1344],
    [1, 0, 0, -1, -1335],
    [0, 0, 3, 1, 1107],
    [4, 0, 0, -1, 1021],
    [4, 0, -1, 1, 833],
    [0, 0, 1, -3, 777],
    [4, 0, -2, 1, 671],
    [2, 0, 0, -3, 607],
    [2, 0, 2, -1, 596],
    [2, -1, 1, -1, 491],
    [2, 0, -2, 1, -451],
    [0, 0, 3, -1, 439],
    [2, 0, 2, 1, 422],
    [2, 0, -3, -1, 421],
    [2, 1, -1, 1, -366],
    [2, 1, 0, 1, -351],
    [4, 0, 0, 1, 331],
    [2, -1, 1, 1, 315],
    [2, -2, 0, -1, 302],
    [0, 0, 1, 3, -283],
    [2, 1, 1, -1, -229],
    [1, 1, 0, -1, 223],
    [1, 1, 0, 1, 223],
    [0, 1, -2, -1, -220],
    [2, 1, -1, -1, -220],
    [1, 0, 1, 1, -185],
    [2, -1, -2, -1, 181],
    [0, 1, 2, 1, -177],
    [4, 0, -2, -1, 176],
    [4, -1, -1, -1, 166],
    [1, 0, 1, -1, -164],
    [4, 0, 1, -1, 132],
    [1, 0, -1, -1, -119],
    [4, -1, 0, -1, 115],
    [2, -2, 0, 1, 107]
  ];
  return tb2.map((row) => {
    const o = {};
    const vals = ["d", "m", "m_", "f", "\u03A3b"];
    vals.forEach((D2R10, i) => {
      o[D2R10] = row[i];
    });
    return o;
  });
})();

// node_modules/astronomia/src/moon.js
var { sin: sin6, cos: cos7, asin: asin3, atan2: atan23 } = Math;
var D2R5 = Math.PI / 180;
var _I = 1.54242 * D2R5;
var [sI, cI] = base_default.sincos(_I);
var lunarCoord = (\u03B7, \u03B8) => new base_default.Coord(\u03B7 * D2R5, \u03B8 * D2R5);
var selenographic = {
  archimedes: lunarCoord(-3.9, 29.7),
  aristarchus: lunarCoord(-47.5, 23.7),
  aristillus: lunarCoord(1.2, 33.9),
  aristoteles: lunarCoord(17.3, 50.1),
  arzachel: lunarCoord(-1.9, -17.7),
  autolycus: lunarCoord(1.5, 30.7),
  billy: lunarCoord(-50, -13.8),
  birt: lunarCoord(-8.5, -22.3),
  campanus: lunarCoord(-27.7, -28),
  censorinus: lunarCoord(32.7, -0.4),
  clavius: lunarCoord(-14, -58),
  copernicus: lunarCoord(-20, 9.7),
  delambre: lunarCoord(17.5, -1.9),
  dionysius: lunarCoord(17.3, 2.8),
  endymion: lunarCoord(56.4, 53.6),
  eratosthenes: lunarCoord(-11.3, 14.5),
  eudoxus: lunarCoord(16.3, 44.3),
  fracastorius: lunarCoord(33.2, -21),
  fraMauro: lunarCoord(-17, -6),
  gassendi: lunarCoord(-39.9, -17.5),
  goclenius: lunarCoord(45, -10.1),
  grimaldi: lunarCoord(-68.5, -5.8),
  harpalus: lunarCoord(-43.4, 52.6),
  horrocks: lunarCoord(5.9, -4),
  kepler: lunarCoord(-38, 8.1),
  langrenus: lunarCoord(60.9, -8.9),
  lansberg: lunarCoord(-26.6, -0.3),
  letronne: lunarCoord(-43, -10),
  macrobius: lunarCoord(46, 21.2),
  manilius: lunarCoord(9.1, 14.5),
  menelaus: lunarCoord(16, 16.3),
  messier: lunarCoord(47.6, -1.9),
  petavius: lunarCoord(61, -25),
  pico: lunarCoord(-8.8, 45.8),
  pitatus: lunarCoord(-13.5, -29.8),
  piton: lunarCoord(-0.8, 40.8),
  plato: lunarCoord(-9.2, 51.4),
  plinius: lunarCoord(23.6, 15.3),
  posidonius: lunarCoord(30, 31.9),
  proclus: lunarCoord(46.9, 16.1),
  ptolemeusA: lunarCoord(-0.8, -8.5),
  pytheas: lunarCoord(-20.6, 20.5),
  reinhold: lunarCoord(-22.8, 3.2),
  riccioli: lunarCoord(-74.3, -3.2),
  schickard: lunarCoord(-54.5, -44),
  schiller: lunarCoord(-39, -52),
  tauruntius: lunarCoord(46.5, 5.6),
  theophilus: lunarCoord(26.5, -11.4),
  timocharis: lunarCoord(-13.1, 26.7),
  tycho: lunarCoord(-11, -43.2),
  vitruvius: lunarCoord(31.3, 17.6),
  walter: lunarCoord(1, -33)
};

// node_modules/astronomia/src/moonillum.js
var D2R6 = Math.PI / 180;

// node_modules/astronomia/src/moonmaxdec.js
var p = Math.PI / 180;
var ck3 = 1 / 1336.86;
var nc2 = {
  D: 152.2029 * p,
  m: 14.8591 * p,
  m_: 4.6881 * p,
  f: 325.8867 * p,
  JDE: 24515625897e-4,
  s: 1,
  tc: [
    0.8975,
    -0.4726,
    -0.103,
    -0.0976,
    -0.0462,
    -0.0461,
    -0.0438,
    0.0162,
    -0.0157,
    0.0145,
    0.0136,
    -95e-4,
    -91e-4,
    -89e-4,
    75e-4,
    -68e-4,
    61e-4,
    -47e-4,
    -43e-4,
    -4e-3,
    -37e-4,
    31e-4,
    3e-3,
    -29e-4,
    -29e-4,
    -27e-4,
    24e-4,
    -21e-4,
    19e-4,
    18e-4,
    18e-4,
    17e-4,
    17e-4,
    -14e-4,
    13e-4,
    13e-4,
    12e-4,
    11e-4,
    -11e-4,
    1e-3,
    1e-3,
    -9e-4,
    7e-4,
    -7e-4
  ],
  dc: [
    5.1093 * p,
    0.2658 * p,
    0.1448 * p,
    -0.0322 * p,
    0.0133 * p,
    0.0125 * p,
    -0.0124 * p,
    -0.0101 * p,
    97e-4 * p,
    -87e-4 * p,
    74e-4 * p,
    67e-4 * p,
    63e-4 * p,
    6e-3 * p,
    -57e-4 * p,
    -56e-4 * p,
    52e-4 * p,
    41e-4 * p,
    -4e-3 * p,
    38e-4 * p,
    -34e-4 * p,
    -29e-4 * p,
    29e-4 * p,
    -28e-4 * p,
    -28e-4 * p,
    -23e-4 * p,
    -21e-4 * p,
    19e-4 * p,
    18e-4 * p,
    17e-4 * p,
    15e-4 * p,
    14e-4 * p,
    -12e-4 * p,
    -12e-4 * p,
    -1e-3 * p,
    -1e-3 * p,
    6e-4 * p
  ]
};
var sc = {
  D: 345.6676 * p,
  m: 1.3951 * p,
  m_: 186.21 * p,
  f: 145.1633 * p,
  JDE: 24515489289e-4,
  s: -1,
  tc: [
    -0.8975,
    -0.4726,
    -0.103,
    -0.0976,
    0.0541,
    0.0516,
    -0.0438,
    0.0112,
    0.0157,
    23e-4,
    -0.0136,
    0.011,
    91e-4,
    89e-4,
    75e-4,
    -3e-3,
    -61e-4,
    -47e-4,
    -43e-4,
    4e-3,
    -37e-4,
    -31e-4,
    3e-3,
    29e-4,
    -29e-4,
    -27e-4,
    24e-4,
    -21e-4,
    -19e-4,
    -6e-4,
    -18e-4,
    -17e-4,
    17e-4,
    14e-4,
    -13e-4,
    -13e-4,
    12e-4,
    11e-4,
    11e-4,
    1e-3,
    1e-3,
    -9e-4,
    -7e-4,
    -7e-4
  ],
  dc: [
    -5.1093 * p,
    0.2658 * p,
    -0.1448 * p,
    0.0322 * p,
    0.0133 * p,
    0.0125 * p,
    -15e-4 * p,
    0.0101 * p,
    -97e-4 * p,
    87e-4 * p,
    74e-4 * p,
    67e-4 * p,
    -63e-4 * p,
    -6e-3 * p,
    57e-4 * p,
    -56e-4 * p,
    -52e-4 * p,
    -41e-4 * p,
    -4e-3 * p,
    -38e-4 * p,
    34e-4 * p,
    -29e-4 * p,
    29e-4 * p,
    28e-4 * p,
    -28e-4 * p,
    23e-4 * p,
    21e-4 * p,
    19e-4 * p,
    18e-4 * p,
    -17e-4 * p,
    15e-4 * p,
    14e-4 * p,
    12e-4 * p,
    -12e-4 * p,
    1e-3 * p,
    -1e-3 * p,
    37e-4 * p
  ]
};

// node_modules/astronomia/src/parallax.js
var horPar = 8.794 / 3600 * Math.PI / 180;

// node_modules/astronomia/src/perihelion.js
var planetsEnum = {
  mercury: 0,
  venus: 1,
  earth: 2,
  mars: 3,
  jupiter: 4,
  saturn: 5,
  uranus: 6,
  neptune: 7,
  embary: 8
};
var mercury = planetsEnum.mercury;
var venus = planetsEnum.venus;
var earth = planetsEnum.earth;
var mars = planetsEnum.mars;
var jupiter = planetsEnum.jupiter;
var saturn = planetsEnum.saturn;
var uranus = planetsEnum.uranus;
var neptune = planetsEnum.neptune;
var embary = planetsEnum.embary;
if (typeof setImmediate !== "function") {
  const setImmediate2 = setTimeout;
}

// node_modules/astronomia/src/planetary.js
function Ca(A, B, M0, M1) {
  this.A = A;
  this.B = B;
  this.M0 = M0;
  this.M1 = M1;
}
var micA = new Ca(2451612023e-3, 115.8774771, 63.5867, 114.2088742);
var mscA = new Ca(2451554084e-3, 115.8774771, 6.4822, 114.2088742);
var vicA = new Ca(2451996706e-3, 583.921361, 82.7311, 215.513058);
var moA = new Ca(2452097382e-3, 779.936104, 181.9573, 48.705244);
var joA = new Ca(2451870628e-3, 398.884046, 318.4681, 33.140229);
var soA = new Ca(245187017e-2, 378.091904, 318.0172, 12.647487);
var scA = new Ca(2451681124e-3, 378.091904, 131.6934, 12.647487);
var uoA = new Ca(2451764317e-3, 369.656035, 213.6884, 4.333093);
var noA = new Ca(2451753122e-3, 367.486703, 202.6544, 2.194998);
function Caa(c, f) {
  this.c = c;
  this.f = f;
}
var jaa = [
  new Caa(82.74, 40.76)
];
var saa = [
  new Caa(82.74, 40.76),
  new Caa(29.86, 1181.36),
  new Caa(14.13, 590.68),
  new Caa(220.02, 1262.87)
];
var uaa = [
  new Caa(207.83, 8.51),
  new Caa(108.84, 419.96)
];
var naa = [
  new Caa(207.83, 8.51),
  new Caa(276.74, 209.98)
];

// node_modules/astronomia/src/pluto.js
function Pt(i, j, k, lA, lB, bA, bB, rA, rB) {
  this.i = i;
  this.j = j;
  this.k = k;
  this.lA = lA;
  this.lB = lB;
  this.bA = bA;
  this.bB = bB;
  this.rA = rA;
  this.rB = rB;
}
var t37 = [
  new Pt(0, 0, 1, -19.799805, 19.850055, -5.452852, -14.974862, 6.6865439, 6.8951812),
  new Pt(0, 0, 2, 0.897144, -4.954829, 3.527812, 1.67279, -1.1827535, -0.0332538),
  new Pt(0, 0, 3, 0.611149, 1.211027, -1.050748, 0.327647, 0.1593179, -0.143889),
  new Pt(0, 0, 4, -0.341243, -0.189585, 0.17869, -0.292153, -18444e-7, 0.048322),
  new Pt(0, 0, 5, 0.129287, -0.034992, 0.01865, 0.10034, -65977e-7, -85431e-7),
  new Pt(0, 0, 6, -0.038164, 0.030893, -0.030697, -0.025823, 31174e-7, -6032e-7),
  new Pt(0, 1, -1, 0.020442, -9987e-6, 4878e-6, 0.011248, -5794e-7, 22161e-7),
  new Pt(0, 1, 0, -4063e-6, -5071e-6, 226e-6, -64e-6, 4601e-7, 4032e-7),
  new Pt(0, 1, 1, -6016e-6, -3336e-6, 203e-5, -836e-6, -1729e-7, 234e-7),
  new Pt(0, 1, 2, -3956e-6, 3039e-6, 69e-6, -604e-6, -415e-7, 702e-7),
  new Pt(0, 1, 3, -667e-6, 3572e-6, -247e-6, -567e-6, 239e-7, 723e-7),
  new Pt(0, 2, -2, 1276e-6, 501e-6, -57e-6, 1e-6, 67e-7, -67e-7),
  new Pt(0, 2, -1, 1152e-6, -917e-6, -122e-6, 175e-6, 1034e-7, -451e-7),
  new Pt(0, 2, 0, 63e-5, -1277e-6, -49e-6, -164e-6, -129e-7, 504e-7),
  new Pt(1, -1, 0, 2571e-6, -459e-6, -197e-6, 199e-6, 48e-6, -231e-7),
  new Pt(1, -1, 1, 899e-6, -1449e-6, -25e-6, 217e-6, 2e-7, -441e-7),
  new Pt(1, 0, -3, -1016e-6, 1043e-6, 589e-6, -248e-6, -3359e-7, 265e-7),
  new Pt(1, 0, -2, -2343e-6, -1012e-6, -269e-6, 711e-6, 7856e-7, -7832e-7),
  new Pt(1, 0, -1, 7042e-6, 788e-6, 185e-6, 193e-6, 36e-7, 45763e-7),
  new Pt(1, 0, 0, 1199e-6, -338e-6, 315e-6, 807e-6, 8663e-7, 8547e-7),
  new Pt(1, 0, 1, 418e-6, -67e-6, -13e-5, -43e-6, -809e-7, -769e-7),
  new Pt(1, 0, 2, 12e-5, -274e-6, 5e-6, 3e-6, 263e-7, -144e-7),
  new Pt(1, 0, 3, -6e-5, -159e-6, 2e-6, 17e-6, -126e-7, 32e-7),
  new Pt(1, 0, 4, -82e-6, -29e-6, 2e-6, 5e-6, -35e-7, -16e-7),
  new Pt(1, 1, -3, -36e-6, -29e-6, 2e-6, 3e-6, -19e-7, -4e-7),
  new Pt(1, 1, -2, -4e-5, 7e-6, 3e-6, 1e-6, -15e-7, 8e-7),
  new Pt(1, 1, -1, -14e-6, 22e-6, 2e-6, -1e-6, -4e-7, 12e-7),
  new Pt(1, 1, 0, 4e-6, 13e-6, 1e-6, -1e-6, 5e-7, 6e-7),
  new Pt(1, 1, 1, 5e-6, 2e-6, 0, -1e-6, 3e-7, 1e-7),
  new Pt(1, 1, 3, -1e-6, 0, 0, 0, 6e-7, -2e-7),
  new Pt(2, 0, -6, 2e-6, 0, 0, -2e-6, 2e-7, 2e-7),
  new Pt(2, 0, -5, -4e-6, 5e-6, 2e-6, 2e-6, -2e-7, -2e-7),
  new Pt(2, 0, -4, 4e-6, -7e-6, -7e-6, 0, 14e-7, 13e-7),
  new Pt(2, 0, -3, 14e-6, 24e-6, 1e-5, -8e-6, -63e-7, 13e-7),
  new Pt(2, 0, -2, -49e-6, -34e-6, -3e-6, 2e-5, 136e-7, -236e-7),
  new Pt(2, 0, -1, 163e-6, -48e-6, 6e-6, 5e-6, 273e-7, 1065e-7),
  new Pt(2, 0, 0, 9e-6, -24e-6, 14e-6, 17e-6, 251e-7, 149e-7),
  new Pt(2, 0, 1, -4e-6, 1e-6, -2e-6, 0, -25e-7, -9e-7),
  new Pt(2, 0, 2, -3e-6, 1e-6, 0, 0, 9e-7, -2e-7),
  new Pt(2, 0, 3, 1e-6, 3e-6, 0, 0, -8e-7, 7e-7),
  new Pt(3, 0, -2, -3e-6, -1e-6, 0, 1e-6, 2e-7, -1e-6),
  new Pt(3, 0, -1, 5e-6, -3e-6, 0, 0, 19e-7, 35e-7),
  new Pt(3, 0, 0, 0, 0, 1e-6, 0, 1e-6, 3e-7)
];

// node_modules/astronomia/src/refraction.js
var { sin: sin7, tan: tan5 } = Math;
var D2R7 = Math.PI / 180;
var gt15true1 = new sexagesimal_default.Angle(false, 0, 0, 58.294).rad();
var gt15true2 = new sexagesimal_default.Angle(false, 0, 0, 0.0668).rad();
var gt15app1 = new sexagesimal_default.Angle(false, 0, 0, 58.276).rad();
var gt15app2 = new sexagesimal_default.Angle(false, 0, 0, 0.0824).rad();

// node_modules/astronomia/src/rise.js
var { acos: acos2, asin: asin4, cos: cos8, sin: sin8 } = Math;
var D2R8 = Math.PI / 180;
var errorAboveHorizon = base_default.errorCode("always above horizon", -1);
var errorBelowHorizon = base_default.errorCode("always below horizon", 1);
var meanRefraction = new sexagesimal_default.Angle(false, 0, 34, 0).rad();
var stdh0 = {
  stellar: -meanRefraction,
  solar: new sexagesimal_default.Angle(true, 0, 50, 0).rad(),
  // not containing meanRefraction
  lunar: sexagesimal_default.angleFromDeg(0.7275),
  lunarMean: sexagesimal_default.angleFromDeg(0.125)
};
function refraction(h0, corr) {
  if (!corr) {
    return h0;
  } else {
    return h0 - meanRefraction - corr;
  }
}
var stdh0Stellar = (_refraction) => refraction(stdh0.stellar, _refraction);
var Stdh0Stellar = stdh0Stellar();
var stdh0Solar = (_refraction) => refraction(stdh0.solar, _refraction);
var Stdh0Solar = stdh0Solar();
var stdh0LunarMean = (_refraction) => {
  return stdh0.lunarMean - refraction(_refraction);
};
var Stdh0LunarMean = stdh0LunarMean();

// node_modules/astronomia/src/saturnmoons.js
var d2 = Math.PI / 180;
function R4(\u03BB, r, \u03B3, \u03A9) {
  this.\u03BB = \u03BB || 0;
  this.r = r || 0;
  this.\u03B3 = \u03B3 || 0;
  this.\u03A9 = \u03A9 || 0;
}
function Qs(jde) {
  this.t1 = jde - 2411093;
  this.t2 = this.t1 / 365.25;
  this.t3 = (jde - 2433282423e-3) / 365.25 + 1950;
  this.t4 = jde - 2411368;
  this.t5 = this.t4 / 365.25;
  this.t6 = jde - 2415020;
  this.t7 = this.t6 / 36525;
  this.t8 = this.t6 / 365.25;
  this.t9 = (jde - 24420005e-1) / 365.25;
  this.t10 = jde - 2409786;
  this.t11 = this.t10 / 36525;
  this.W0 = 5.095 * d2 * (this.t3 - 1866.39);
  this.W1 = 74.4 * d2 + 32.39 * d2 * this.t2;
  this.W2 = 134.3 * d2 + 92.62 * d2 * this.t2;
  this.W3 = 42 * d2 - 0.5118 * d2 * this.t5;
  this.W4 = 276.59 * d2 + 0.5118 * d2 * this.t5;
  this.W5 = 267.2635 * d2 + 1222.1136 * d2 * this.t7;
  this.W6 = 175.4762 * d2 + 1221.5515 * d2 * this.t7;
  this.W7 = 2.4891 * d2 + 2435e-6 * d2 * this.t7;
  this.W8 = 113.35 * d2 - 0.2597 * d2 * this.t7;
  this.s1 = Math.sin(28.0817 * d2);
  this.c1 = Math.cos(28.0817 * d2);
  this.s2 = Math.sin(168.8112 * d2);
  this.c2 = Math.cos(168.8112 * d2);
  this.e1 = 0.05589 - 346e-6 * this.t7;
  this.sW0 = Math.sin(this.W0);
  this.s3W0 = Math.sin(3 * this.W0);
  this.s5W0 = Math.sin(5 * this.W0);
  this.sW1 = Math.sin(this.W1);
  this.sW2 = Math.sin(this.W2);
  this.sW3 = Math.sin(this.W3);
  this.cW3 = Math.cos(this.W3);
  this.sW4 = Math.sin(this.W4);
  this.cW4 = Math.cos(this.W4);
  this.sW7 = Math.sin(this.W7);
  this.cW7 = Math.cos(this.W7);
  return this;
}
Qs.prototype.mimas = function() {
  const r = new R4();
  const L2 = 127.64 * d2 + 381.994497 * d2 * this.t1 - 43.57 * d2 * this.sW0 - 0.72 * d2 * this.s3W0 - 0.02144 * d2 * this.s5W0;
  const p3 = 106.1 * d2 + 365.549 * d2 * this.t2;
  const M = L2 - p3;
  const C = 2.18287 * d2 * Math.sin(M) + 0.025988 * d2 * Math.sin(2 * M) + 43e-5 * d2 * Math.sin(3 * M);
  r.\u03BB = L2 + C;
  r.r = 3.06879 / (1 + 0.01905 * Math.cos(M + C));
  r.\u03B3 = 1.563 * d2;
  r.\u03A9 = 54.5 * d2 - 365.072 * d2 * this.t2;
  return r;
};
Qs.prototype.enceladus = function() {
  const r = new R4();
  const L2 = 200.317 * d2 + 262.7319002 * d2 * this.t1 + 0.25667 * d2 * this.sW1 + 0.20883 * d2 * this.sW2;
  const p3 = 309.107 * d2 + 123.44121 * d2 * this.t2;
  const M = L2 - p3;
  const C = 0.55577 * d2 * Math.sin(M) + 168e-5 * d2 * Math.sin(2 * M);
  r.\u03BB = L2 + C;
  r.r = 3.94118 / (1 + 485e-5 * Math.cos(M + C));
  r.\u03B3 = 0.0262 * d2;
  r.\u03A9 = 348 * d2 - 151.95 * d2 * this.t2;
  return r;
};
Qs.prototype.tethys = function() {
  const r = new R4();
  r.\u03BB = 285.306 * d2 + 190.69791226 * d2 * this.t1 + 2.063 * d2 * this.sW0 + 0.03409 * d2 * this.s3W0 + 1015e-6 * d2 * this.s5W0;
  r.r = 4.880998;
  r.\u03B3 = 1.0976 * d2;
  r.\u03A9 = 111.33 * d2 - 72.2441 * d2 * this.t2;
  return r;
};
Qs.prototype.dione = function() {
  const r = new R4();
  const L2 = 254.712 * d2 + 131.53493193 * d2 * this.t1 - 0.0215 * d2 * this.sW1 - 0.01733 * d2 * this.sW2;
  const p3 = 174.8 * d2 + 30.82 * d2 * this.t2;
  const M = L2 - p3;
  const C = 0.24717 * d2 * Math.sin(M) + 33e-5 * d2 * Math.sin(2 * M);
  r.\u03BB = L2 + C;
  r.r = 6.24871 / (1 + 2157e-6 * Math.cos(M + C));
  r.\u03B3 = 0.0139 * d2;
  r.\u03A9 = 232 * d2 - 30.27 * d2 * this.t2;
  return r;
};
Qs.prototype.rhea = function() {
  const p\u02B9 = 342.7 * d2 + 10.057 * d2 * this.t2;
  const [sp\u02B9, cp\u02B9] = base_default.sincos(p\u02B9);
  const a1 = 265e-6 * sp\u02B9 + 1e-3 * this.sW4;
  const a2 = 265e-6 * cp\u02B9 + 1e-3 * this.cW4;
  const e = Math.hypot(a1, a2);
  const p3 = Math.atan2(a1, a2);
  const N = 345 * d2 - 10.057 * d2 * this.t2;
  const [sN, cN] = base_default.sincos(N);
  const \u03BB\u02B9 = 359.244 * d2 + 79.6900472 * d2 * this.t1 + 0.086754 * d2 * sN;
  const i = 28.0362 * d2 + 0.346898 * d2 * cN + 0.0193 * d2 * this.cW3;
  const \u03A9 = 168.8034 * d2 + 0.736936 * d2 * sN + 0.041 * d2 * this.sW3;
  const a = 8.725924;
  return this.subr(\u03BB\u02B9, p3, e, a, \u03A9, i);
};
Qs.prototype.subr = function(\u03BB\u02B9, p3, e, a, \u03A9, i) {
  const r = new R4();
  const M = \u03BB\u02B9 - p3;
  const e2 = e * e;
  const e3 = e2 * e;
  const e4 = e2 * e2;
  const e5 = e3 * e2;
  const C = (2 * e - 0.25 * e3 + 0.0520833333 * e5) * Math.sin(M) + (1.25 * e2 - 0.458333333 * e4) * Math.sin(2 * M) + (1.083333333 * e3 - 0.671875 * e5) * Math.sin(3 * M) + 1.072917 * e4 * Math.sin(4 * M) + 1.142708 * e5 * Math.sin(5 * M);
  r.r = a * (1 - e2) / (1 + e * Math.cos(M + C));
  const g = \u03A9 - 168.8112 * d2;
  const [si, ci] = base_default.sincos(i);
  const [sg, cg] = base_default.sincos(g);
  const a1 = si * sg;
  const a2 = this.c1 * si * cg - this.s1 * ci;
  r.\u03B3 = Math.asin(Math.hypot(a1, a2));
  const u = Math.atan2(a1, a2);
  r.\u03A9 = 168.8112 * d2 + u;
  const h = this.c1 * si - this.s1 * ci * cg;
  const \u03C8 = Math.atan2(this.s1 * sg, h);
  r.\u03BB = \u03BB\u02B9 + C + u - g - \u03C8;
  return r;
};
Qs.prototype.titan = function() {
  const L2 = 261.1582 * d2 + 22.57697855 * d2 * this.t4 + 0.074025 * d2 * this.sW3;
  const i\u02B9 = 27.45141 * d2 + 0.295999 * d2 * this.cW3;
  const \u03A9\u02B9 = 168.66925 * d2 + 0.628808 * d2 * this.sW3;
  const [si\u02B9, ci\u02B9] = base_default.sincos(i\u02B9);
  const [s\u03A9\u02B9W8, c\u03A9\u02B9W8] = base_default.sincos(\u03A9\u02B9 - this.W8);
  const a1 = this.sW7 * s\u03A9\u02B9W8;
  const a2 = this.cW7 * si\u02B9 - this.sW7 * ci\u02B9 * c\u03A9\u02B9W8;
  const g0 = 102.8623 * d2;
  const \u03C8 = Math.atan2(a1, a2);
  const s2 = Math.hypot(a1, a2);
  let g = this.W4 - \u03A9\u02B9 - \u03C8;
  let \u03D6 = 0;
  const [s2g0, c2g0] = base_default.sincos(2 * g0);
  const f = () => {
    \u03D6 = this.W4 + 0.37515 * d2 * (Math.sin(2 * g) - s2g0);
    g = \u03D6 - \u03A9\u02B9 - \u03C8;
  };
  f();
  f();
  f();
  const e\u02B9 = 0.029092 + 19048e-8 * (Math.cos(2 * g) - c2g0);
  const qq = 2 * (this.W5 - \u03D6);
  const b1 = si\u02B9 * s\u03A9\u02B9W8;
  const b2 = this.cW7 * si\u02B9 * c\u03A9\u02B9W8 - this.sW7 * ci\u02B9;
  const \u03B8 = Math.atan2(b1, b2) + this.W8;
  const [sq, cq] = base_default.sincos(qq);
  const e = e\u02B9 + 2778797e-9 * e\u02B9 * cq;
  const p3 = \u03D6 + 0.159215 * d2 * sq;
  const u = 2 * this.W5 - 2 * \u03B8 + \u03C8;
  const [su, cu] = base_default.sincos(u);
  const h = 0.9375 * e\u02B9 * e\u02B9 * sq + 0.1875 * s2 * s2 * Math.sin(2 * (this.W5 - \u03B8));
  const \u03BB\u02B9 = L2 - 0.254744 * d2 * (this.e1 * Math.sin(this.W6) + 0.75 * this.e1 * this.e1 * Math.sin(2 * this.W6) + h);
  const i = i\u02B9 + 0.031843 * d2 * s2 * cu;
  const \u03A9 = \u03A9\u02B9 + 0.031843 * d2 * s2 * su / si\u02B9;
  const a = 20.216193;
  return this.subr(\u03BB\u02B9, p3, e, a, \u03A9, i);
};
Qs.prototype.hyperion = function() {
  const \u03B7 = 92.39 * d2 + 0.5621071 * d2 * this.t6;
  const \u03B6 = 148.19 * d2 - 19.18 * d2 * this.t8;
  const \u03B8 = 184.8 * d2 - 35.41 * d2 * this.t9;
  const \u03B8\u02B9 = \u03B8 - 7.5 * d2;
  const as = 176 * d2 + 12.22 * d2 * this.t8;
  const bs = 8 * d2 + 24.44 * d2 * this.t8;
  const cs = bs + 5 * d2;
  const \u03D6 = 69.898 * d2 - 18.67088 * d2 * this.t8;
  const \u03C6 = 2 * (\u03D6 - this.W5);
  const \u03C7 = 94.9 * d2 - 2.292 * d2 * this.t8;
  const [s\u03B7, c\u03B7] = base_default.sincos(\u03B7);
  const [s\u03B6, c\u03B6] = base_default.sincos(\u03B6);
  const [s2\u03B6, c2\u03B6] = base_default.sincos(2 * \u03B6);
  const [s3\u03B6, c3\u03B6] = base_default.sincos(3 * \u03B6);
  const [s\u03B6p\u03B7, c\u03B6p\u03B7] = base_default.sincos(\u03B6 + \u03B7);
  const [s\u03B6m\u03B7, c\u03B6m\u03B7] = base_default.sincos(\u03B6 - \u03B7);
  const [s\u03C6, c\u03C6] = base_default.sincos(\u03C6);
  const [s\u03C7, c\u03C7] = base_default.sincos(\u03C7);
  const [scs, ccs] = base_default.sincos(cs);
  const a = 24.50601 - 0.08686 * c\u03B7 - 166e-5 * c\u03B6p\u03B7 + 175e-5 * c\u03B6m\u03B7;
  const e = 0.103458 - 4099e-6 * c\u03B7 - 167e-6 * c\u03B6p\u03B7 + 235e-6 * c\u03B6m\u03B7 + 0.02303 * c\u03B6 - 212e-5 * c2\u03B6 + 151e-6 * c3\u03B6 + 13e-5 * c\u03C6;
  const p3 = \u03D6 + 0.15648 * d2 * s\u03C7 - 0.4457 * d2 * s\u03B7 - 0.2657 * d2 * s\u03B6p\u03B7 - 0.3573 * d2 * s\u03B6m\u03B7 - 12.872 * d2 * s\u03B6 + 1.668 * d2 * s2\u03B6 - 0.2419 * d2 * s3\u03B6 - 0.07 * d2 * s\u03C6;
  const \u03BB\u02B9 = 177.047 * d2 + 16.91993829 * d2 * this.t6 + 0.15648 * d2 * s\u03C7 + 9.142 * d2 * s\u03B7 + 7e-3 * d2 * Math.sin(2 * \u03B7) - 0.014 * d2 * Math.sin(3 * \u03B7) + 0.2275 * d2 * s\u03B6p\u03B7 + 0.2112 * d2 * s\u03B6m\u03B7 - 0.26 * d2 * s\u03B6 - 98e-4 * d2 * s2\u03B6 - 0.013 * d2 * Math.sin(as) + 0.017 * d2 * Math.sin(bs) - 0.0303 * d2 * s\u03C6;
  const i = 27.3347 * d2 + 0.6434886 * d2 * c\u03C7 + 0.315 * d2 * this.cW3 + 0.018 * d2 * Math.cos(\u03B8) - 0.018 * d2 * ccs;
  const \u03A9 = 168.6812 * d2 + 1.40136 * d2 * c\u03C7 + 0.68599 * d2 * this.sW3 - 0.0392 * d2 * scs + 0.0366 * d2 * Math.sin(\u03B8\u02B9);
  return this.subr(\u03BB\u02B9, p3, e, a, \u03A9, i);
};
Qs.prototype.iapetus = function() {
  const L2 = 261.1582 * d2 + 22.57697855 * d2 * this.t4;
  const \u03D6\u02B9 = 91.796 * d2 + 0.562 * d2 * this.t7;
  const \u03C8 = 4.367 * d2 - 0.195 * d2 * this.t7;
  const \u03B8 = 146.819 * d2 - 3.198 * d2 * this.t7;
  const \u03C6 = 60.47 * d2 + 1.521 * d2 * this.t7;
  const \u03A6 = 205.055 * d2 - 2.091 * d2 * this.t7;
  const e\u02B9 = 0.028298 + 1156e-6 * this.t11;
  const \u03D60 = 352.91 * d2 + 11.71 * d2 * this.t11;
  const \u03BC = 76.3852 * d2 + 4.53795125 * d2 * this.t10;
  const i\u02B9 = base_default.horner(this.t11, 18.4602 * d2, -0.9518 * d2, -0.072 * d2, 54e-4 * d2);
  const \u03A9\u02B9 = base_default.horner(this.t11, 143.198 * d2, -3.919 * d2, 0.116 * d2, 8e-3 * d2);
  const l = \u03BC - \u03D60;
  const g = \u03D60 - \u03A9\u02B9 - \u03C8;
  const g1 = \u03D60 - \u03A9\u02B9 - \u03C6;
  const ls = this.W5 - \u03D6\u02B9;
  const gs = \u03D6\u02B9 - \u03B8;
  const lT = L2 - this.W4;
  const gT = this.W4 - \u03A6;
  const u1 = 2 * (l + g - ls - gs);
  const u2 = l + g1 - lT - gT;
  const u3 = l + 2 * (g - ls - gs);
  const u4 = lT + gT - g1;
  const u5 = 2 * (ls + gs);
  const [sl, cl] = base_default.sincos(l);
  const [su1, cu1] = base_default.sincos(u1);
  const [su2, cu2] = base_default.sincos(u2);
  const [su3, cu3] = base_default.sincos(u3);
  const [su4, cu4] = base_default.sincos(u4);
  const [slu2, clu2] = base_default.sincos(l + u2);
  const [sg1gT, cg1gT] = base_default.sincos(g1 - gT);
  const [su52g, cu52g] = base_default.sincos(u5 - 2 * g);
  const [su5\u03C8, cu5\u03C8] = base_default.sincos(u5 + \u03C8);
  const [su2\u03C6, cu2\u03C6] = base_default.sincos(u2 + \u03C6);
  const [s5, c5] = base_default.sincos(l + g1 + lT + gT + \u03C6);
  const a = 58.935028 + 4638e-6 * cu1 + 0.058222 * cu2;
  const e = e\u02B9 - 14097e-7 * cg1gT + 3733e-7 * cu52g + 118e-6 * cu3 + 2408e-7 * cl + 2849e-7 * clu2 + 619e-6 * cu4;
  const w = 0.08077 * d2 * sg1gT + 0.02139 * d2 * su52g - 676e-5 * d2 * su3 + 0.0138 * d2 * sl + 0.01632 * d2 * slu2 + 0.03547 * d2 * su4;
  const p3 = \u03D60 + w / e\u02B9;
  const \u03BB\u02B9 = \u03BC - 0.04299 * d2 * su2 - 789e-5 * d2 * su1 - 0.06312 * d2 * Math.sin(ls) - 295e-5 * d2 * Math.sin(2 * ls) - 0.02231 * d2 * Math.sin(u5) + 65e-4 * d2 * su5\u03C8;
  const i = i\u02B9 + 0.04204 * d2 * cu5\u03C8 + 235e-5 * d2 * c5 + 36e-4 * d2 * cu2\u03C6;
  const w\u02B9 = 0.04204 * d2 * su5\u03C8 + 235e-5 * d2 * s5 + 358e-5 * d2 * su2\u03C6;
  const \u03A9 = \u03A9\u02B9 + w\u02B9 / Math.sin(i\u02B9);
  return this.subr(\u03BB\u02B9, p3, e, a, \u03A9, i);
};

// node_modules/astronomia/src/solstice.js
var { abs: abs2, cos: cos9, sin: sin9 } = Math;
var D2R9 = Math.PI / 180;
var mc0 = [172113929189e-5, 365242.1374, 0.06134, 111e-5, -71e-5];
var jc0 = [172123325401e-5, 365241.72562, -0.05323, 907e-5, 25e-5];
var sc0 = [172132570455e-5, 365242.49558, -0.11677, -297e-5, 74e-5];
var dc0 = [172141439987e-5, 365242.88257, -769e-5, -933e-5, -6e-5];
var mc2 = [245162380984e-5, 365242.37404, 0.05169, -411e-5, -57e-5];
var jc2 = [245171656767e-5, 365241.62603, 325e-5, 888e-5, -3e-4];
var sc2 = [245181021715e-5, 365242.01767, -0.11575, 337e-5, 78e-5];
var dc2 = [245190005952e-5, 365242.74049, -0.06223, -823e-5, 32e-5];
var terms = (function() {
  const term = [
    [485, 324.96, 1934.136],
    [203, 337.23, 32964.467],
    [199, 342.08, 20.186],
    [182, 27.85, 445267.112],
    [156, 73.14, 45036.886],
    [136, 171.52, 22518.443],
    [77, 222.54, 65928.934],
    [74, 296.72, 3034.906],
    [70, 243.58, 9037.513],
    [58, 119.81, 33718.147],
    [52, 297.17, 150.678],
    [50, 21.02, 2281.226],
    [45, 247.54, 29929.562],
    [44, 325.15, 31555.956],
    [29, 60.93, 4443.417],
    [18, 155.12, 67555.328],
    [17, 288.79, 4562.452],
    [16, 198.04, 62894.029],
    [14, 199.76, 31436.921],
    [12, 95.39, 14577.848],
    [12, 287.11, 31931.756],
    [12, 320.81, 34777.259],
    [9, 227.73, 1222.114],
    [8, 15.45, 16859.074]
  ];
  return term.map((t) => {
    return {
      a: t[0],
      b: t[1],
      c: t[2]
    };
  });
})();
function march(y) {
  if (y < 1e3) {
    return eq(y, mc0);
  }
  return eq(y - 2e3, mc2);
}
function june(y) {
  if (y < 1e3) {
    return eq(y, jc0);
  }
  return eq(y - 2e3, jc2);
}
function september(y) {
  if (y < 1e3) {
    return eq(y, sc0);
  }
  return eq(y - 2e3, sc2);
}
function december(y) {
  if (y < 1e3) {
    return eq(y, dc0);
  }
  return eq(y - 2e3, dc2);
}
function eq(y, c) {
  const J0 = base_default.horner(y * 1e-3, c);
  const T = base_default.J2000Century(J0);
  const W = 35999.373 * D2R9 * T - 2.47 * D2R9;
  const \u0394\u03BB = 1 + 0.0334 * cos9(W) + 7e-4 * cos9(2 * W);
  let S = 0;
  for (let i = terms.length - 1; i >= 0; i--) {
    const t = terms[i];
    S += t.a * cos9((t.b + t.c * T) * D2R9);
  }
  return J0 + 1e-5 * S / \u0394\u03BB;
}
function march2(year, planet) {
  return longitude(year, planet, 0);
}
function june2(year, planet) {
  return longitude(year, planet, Math.PI / 2);
}
function september2(year, planet) {
  return longitude(year, planet, Math.PI);
}
function december2(year, planet) {
  return longitude(year, planet, Math.PI * 3 / 2);
}
function longitude(year, planet, lon) {
  let c;
  let ct;
  if (year < 1e3) {
    ct = [mc0, jc0, sc0, dc0];
  } else {
    ct = [mc2, jc2, sc2, dc2];
    year -= 2e3;
  }
  lon = lon % (Math.PI * 2);
  if (lon < Math.PI / 2) {
    c = ct[0];
  } else if (lon < Math.PI) {
    c = ct[1];
  } else if (lon < Math.PI * 3 / 2) {
    c = ct[2];
  } else {
    c = ct[3];
  }
  return eq2(year, planet, lon, c);
}
function eq2(year, planet, lon, c) {
  let J0 = base_default.horner(year * 1e-3, c);
  for (; ; ) {
    const a = solar_default.apparentVSOP87(planet, J0);
    const c2 = 58 * sin9(lon - a.lon);
    J0 += c2;
    if (abs2(c2) < 5e-6) {
      break;
    }
  }
  return J0;
}
var solstice_default = {
  march,
  june,
  september,
  december,
  march2,
  june2,
  september2,
  december2,
  longitude
};

// node_modules/astronomia/src/sunrise.js
var stdh02 = {
  sunrise: new sexagesimal_default.Angle(true, 0, 50, 0).rad(),
  sunriseEnd: new sexagesimal_default.Angle(true, 0, 18, 0).rad(),
  twilight: new sexagesimal_default.Angle(true, 6, 0, 0).rad(),
  nauticalTwilight: new sexagesimal_default.Angle(true, 12, 0, 0).rad(),
  night: new sexagesimal_default.Angle(true, 18, 0, 0).rad(),
  goldenHour: new sexagesimal_default.Angle(false, 6, 0, 0).rad()
};

// node_modules/astronomia/data/vsop87Bearth.js
var m2 = {
  L: {
    "0": [
      [1.75347045673, 0, 0],
      [0.03341656453, 4.66925680415, 6283.0758499914],
      [34894275e-11, 4.62610242189, 12566.1516999828],
      [3417572e-11, 2.82886579754, 3.523118349],
      [3497056e-11, 2.74411783405, 5753.3848848968],
      [3135899e-11, 3.62767041756, 77713.7714681205],
      [2676218e-11, 4.41808345438, 7860.4193924392],
      [2342691e-11, 6.13516214446, 3930.2096962196],
      [1273165e-11, 2.03709657878, 529.6909650946],
      [1324294e-11, 0.74246341673, 11506.7697697936],
      [901854e-11, 2.04505446477, 26.2983197998],
      [1199167e-11, 1.10962946234, 1577.3435424478],
      [857223e-11, 3.50849152283, 398.1490034082],
      [779786e-11, 1.17882681962, 5223.6939198022],
      [99025e-10, 5.23268072088, 5884.9268465832],
      [753141e-11, 2.53339052847, 5507.5532386674],
      [505267e-11, 4.58292599973, 18849.2275499742],
      [492392e-11, 4.20505711826, 775.522611324],
      [356672e-11, 2.91954114478, 0.0673103028],
      [284125e-11, 1.89869240932, 796.2980068164],
      [242879e-11, 0.34481445893, 5486.777843175],
      [317087e-11, 5.84901948512, 11790.6290886588],
      [271112e-11, 0.31486255375, 10977.078804699],
      [206217e-11, 4.80646631478, 2544.3144198834],
      [205478e-11, 1.86953770281, 5573.1428014331],
      [202318e-11, 2.45767790232, 6069.7767545534],
      [126225e-11, 1.08295459501, 20.7753954924],
      [155516e-11, 0.83306084617, 213.299095438],
      [115132e-11, 0.64544911683, 0.9803210682],
      [102851e-11, 0.63599845579, 4694.0029547076],
      [101724e-11, 4.2667980198, 7.1135470008],
      [99206e-11, 6.20992926918, 2146.1654164752],
      [132212e-11, 3.41118292683, 2942.4634232916],
      [97607e-11, 0.68101342359, 155.4203994342],
      [85128e-11, 1.29870764804, 6275.9623029906],
      [74651e-11, 1.755089133, 5088.6288397668],
      [101895e-11, 0.97569280312, 15720.8387848784],
      [84711e-11, 3.67080093031, 71430.69561812909],
      [73547e-11, 4.67926633877, 801.8209311238],
      [73874e-11, 3.50319414955, 3154.6870848956],
      [78757e-11, 3.03697458703, 12036.4607348882],
      [79637e-11, 1.80791287082, 17260.1546546904],
      [85803e-11, 5.9832263126, 161000.6857376741],
      [56963e-11, 2.78430458592, 6286.5989683404],
      [61148e-11, 1.81839892984, 7084.8967811152],
      [69627e-11, 0.83297621398, 9437.762934887],
      [56116e-11, 4.38694865354, 14143.4952424306],
      [62449e-11, 3.97763912806, 8827.3902698748],
      [51145e-11, 0.28306832879, 5856.4776591154],
      [55577e-11, 3.47006059924, 6279.5527316424],
      [41036e-11, 5.36817592855, 8429.2412664666],
      [51605e-11, 1.33282739866, 1748.016413067],
      [51992e-11, 0.18914947184, 12139.5535091068],
      [49e-8, 0.48735014197, 1194.4470102246],
      [392e-9, 6.16833020996, 10447.3878396044],
      [3557e-10, 1.775968892, 6812.766815086],
      [3677e-10, 6.04133863162, 10213.285546211],
      [36596e-11, 2.56957481827, 1059.3819301892],
      [33296e-11, 0.59310278598, 17789.845619785],
      [35954e-11, 1.70875808777, 2352.8661537718],
      [40938e-11, 2.39850938714, 19651.048481098],
      [30047e-11, 2.73975124088, 1349.8674096588],
      [30412e-11, 0.44294464169, 83996.84731811189],
      [23663e-11, 0.48473622521, 8031.0922630584],
      [23574e-11, 2.06528133162, 3340.6124266998],
      [21089e-11, 4.14825468851, 951.7184062506],
      [24738e-11, 0.21484762138, 3.5904286518],
      [25352e-11, 3.16470891653, 4690.4798363586],
      [22823e-11, 5.22195230819, 4705.7323075436],
      [21419e-11, 1.42563910473, 16730.4636895958],
      [21891e-11, 5.55594302779, 553.5694028424],
      [17481e-11, 4.56052900312, 135.0650800354],
      [19927e-11, 5.22209149316, 12168.0026965746],
      [1986e-10, 5.77470242235, 6309.3741697912],
      [203e-9, 0.37133792946, 283.8593188652],
      [14421e-11, 4.19315052005, 242.728603974],
      [16225e-11, 5.98837767951, 11769.8536931664],
      [15077e-11, 4.1956716337, 6256.7775301916],
      [19124e-11, 3.82219958698, 23581.2581773176],
      [18888e-11, 5.38626892076, 149854.4001348079],
      [14346e-11, 3.72355084422, 38.0276726358],
      [17898e-11, 2.21490566029, 13367.9726311066],
      [12054e-11, 2.62229602614, 955.5997416086],
      [11287e-11, 0.17739329984, 4164.311989613],
      [13973e-11, 4.40134615007, 6681.2248533996],
      [13621e-11, 1.88934516495, 7632.9432596502],
      [12503e-11, 1.13052412208, 5.5229243074],
      [10498e-11, 5.35909979317, 1592.5960136328],
      [9803e-11, 0.99948172646, 11371.7046897582],
      [922e-10, 4.57138585348, 4292.3308329504],
      [10327e-11, 6.19982170609, 6438.4962494256],
      [12003e-11, 1.00351462266, 632.7837393132],
      [10827e-11, 0.32734523824, 103.0927742186],
      [8356e-11, 4.53902748706, 25132.3033999656],
      [10005e-11, 6.0291496328, 5746.271337896],
      [8409e-11, 3.29946177848, 7234.794256242],
      [8006e-11, 5.82145271855, 28.4491874678],
      [10523e-11, 0.93870455544, 11926.2544136688],
      [7686e-11, 3.1214364064, 7238.6755916],
      [9378e-11, 2.62413793196, 5760.4984318976],
      [8127e-11, 6.11227839253, 4732.0306273434],
      [9232e-11, 0.48344234496, 522.5774180938],
      [9802e-11, 5.24413877132, 27511.4678735372],
      [7871e-11, 0.99590133077, 5643.1785636774],
      [8123e-11, 6.27053020099, 426.598190876],
      [9048e-11, 5.33686323585, 6386.16862421],
      [8621e-11, 4.16537179089, 7058.5984613154],
      [6297e-11, 4.71723143652, 6836.6452528338],
      [7575e-11, 3.97381357237, 11499.6562227928],
      [7756e-11, 2.95728422442, 23013.5395395872],
      [7314e-11, 0.60652522715, 11513.8833167944],
      [5955e-11, 2.87641047954, 6283.14316029419],
      [6534e-11, 5.79046406784, 18073.7049386502],
      [7188e-11, 3.99831461988, 74.7815985673],
      [7346e-11, 4.38582423903, 316.3918696566],
      [5413e-11, 5.39199023275, 419.4846438752],
      [5127e-11, 2.36059551778, 10973.55568635],
      [7056e-11, 0.32258442532, 263.0839233728],
      [6624e-11, 3.6647416584, 17298.1823273262],
      [6762e-11, 5.91131766896, 90955.5516944961],
      [4938e-11, 5.73672172371, 9917.6968745098],
      [5547e-11, 2.45152589382, 12352.8526045448],
      [5958e-11, 3.3205134466, 6283.0085396886],
      [4471e-11, 2.06386138131, 7079.3738568078],
      [6153e-11, 1.45823347458, 233141.3144043615],
      [4348e-11, 4.42338625285, 5216.5803728014],
      [6124e-11, 1.07494838623, 19804.8272915828],
      [4488e-11, 3.65285033073, 206.1855484372],
      [402e-10, 0.83995823171, 20.3553193988],
      [5188e-11, 4.06503864016, 6208.2942514241],
      [5307e-11, 0.38216728132, 31441.6775697568],
      [3785e-11, 2.34369213733, 3.881335358],
      [4497e-11, 3.27230792447, 11015.1064773348],
      [4132e-11, 0.92129851256, 3738.761430108],
      [3521e-11, 5.9784480361, 3894.1818295422],
      [4215e-11, 1.90601721876, 245.8316462294],
      [3701e-11, 5.03067498875, 536.8045120954],
      [3866e-11, 1.82632980909, 11856.2186514245],
      [3652e-11, 1.01840564429, 16200.7727245012],
      [339e-10, 0.97784870142, 8635.9420037632],
      [3737e-11, 2.9537891957, 3128.3887650958],
      [3507e-11, 3.71291946317, 6290.1893969922],
      [3086e-11, 3.64646921512, 10.6366653498],
      [3397e-11, 1.10589356888, 14712.317116458],
      [3334e-11, 0.83684903082, 6496.3749454294],
      [2805e-11, 2.58503711584, 14314.1681130498],
      [365e-10, 1.08344142571, 88860.05707098669],
      [3388e-11, 3.20182380957, 5120.6011455836],
      [3252e-11, 3.47857474229, 6133.5126528568],
      [2553e-11, 3.9486902726, 1990.745017041],
      [352e-10, 2.05559692878, 244287.60000722768],
      [2565e-11, 1.56072409371, 23543.23050468179],
      [2621e-11, 3.85639359951, 266.6070417218],
      [2954e-11, 3.39692614359, 9225.539273283],
      [2876e-11, 6.02633318445, 154717.6098876827],
      [2395e-11, 1.16130078696, 10984.1923516998],
      [3161e-11, 1.32798862116, 10873.9860304804],
      [3163e-11, 5.08946546862, 21228.3920235458],
      [2361e-11, 4.27212461943, 6040.3472460174],
      [303e-10, 1.80210001168, 35371.8872659764],
      [2343e-11, 3.57688971514, 10969.9652576982],
      [2618e-11, 2.57870151918, 22483.84857449259],
      [2113e-11, 3.71711179417, 65147.6197681377],
      [2019e-11, 0.81393923319, 170.6728706192],
      [2003e-11, 0.38091017375, 6172.869528772],
      [2506e-11, 3.74378169126, 10575.4066829418],
      [2381e-11, 0.10581361289, 7.046236698],
      [1949e-11, 4.86892513469, 36.0278666774],
      [2074e-11, 4.22802468213, 5650.2921106782],
      [1924e-11, 5.59460549844, 6282.0955289232],
      [1949e-11, 1.06999605576, 5230.807466803],
      [1988e-11, 5.19734705445, 6262.300454499],
      [1887e-11, 3.74365662683, 23.8784377478],
      [1787e-11, 1.25929659066, 12559.038152982],
      [1883e-11, 1.90364058477, 15.252471185],
      [1816e-11, 3.68083794819, 15110.4661198662],
      [1701e-11, 4.41109562589, 110.2063212194],
      [199e-10, 3.93295788548, 6206.8097787158],
      [2103e-11, 0.75354936681, 13521.7514415914],
      [1774e-11, 0.48750515837, 1551.045222648],
      [1882e-11, 0.86685462305, 22003.9146348698],
      [1924e-11, 1.22901099088, 709.9330485583],
      [2073e-11, 4.62531597856, 6037.244203762],
      [1924e-11, 0.60231842492, 6284.0561710596],
      [1596e-11, 3.98332879712, 13916.0191096416],
      [1664e-11, 4.41947015623, 8662.240323563],
      [1971e-11, 1.04560686192, 18209.33026366019],
      [1942e-11, 4.31335979989, 6244.9428143536],
      [1476e-11, 0.93274523818, 2379.1644735716],
      [181e-10, 0.49112137707, 1.4844727083],
      [1346e-11, 1.51574753411, 4136.9104335162],
      [1528e-11, 5.61833568587, 6127.6554505572],
      [1791e-11, 3.22191142746, 39302.096962196],
      [1747e-11, 3.05595292589, 18319.5365848796],
      [1432e-11, 4.51123984264, 20426.571092422],
      [1695e-11, 0.22049418623, 25158.6017197654],
      [1242e-11, 4.46665354536, 17256.6315363414],
      [1463e-11, 4.69248613506, 14945.3161735544],
      [1205e-11, 1.86911906771, 4590.910180489],
      [119e-10, 2.74169967367, 12569.6748183318],
      [1222e-11, 5.18120087481, 5333.9002410216],
      [139e-10, 5.42888623322, 143571.32428481648],
      [1473e-11, 1.70487100866, 11712.9553182308],
      [1362e-11, 2.61069503292, 6062.6632075526],
      [1148e-11, 6.0300843061, 3634.6210245184],
      [1198e-11, 5.15296117339, 10177.2576795336],
      [1266e-11, 0.11422490557, 18422.62935909819],
      [1411e-11, 1.09910890045, 3496.032826134],
      [1349e-11, 2.99804623019, 17654.7805397496],
      [1253e-11, 2.79844902576, 167283.7615876655],
      [1311e-11, 1.609410743, 5481.2549188676],
      [1079e-11, 6.20304501787, 3.2863574178],
      [1181e-11, 1.20653777627, 131.5419616864],
      [1254e-11, 5.45103277799, 6076.8903015542],
      [1036e-11, 2.32136959491, 7342.4577801806],
      [1117e-11, 0.38842340979, 949.1756089698],
      [966e-11, 3.18352079941, 11087.2851259184],
      [1171e-11, 3.39635167732, 12562.6285816338],
      [1121e-11, 0.72631814699, 220.4126424388],
      [1024e-11, 2.19381113265, 11403.676995575],
      [888e-11, 3.91167196431, 4686.8894077068],
      [91e-10, 1.98802695087, 735.8765135318],
      [823e-11, 0.48822202854, 24072.9214697764],
      [1096e-11, 6.17377835617, 5436.9930152402],
      [908e-11, 0.44959148878, 7477.522860216],
      [974e-11, 1.52996313552, 9623.6882766912],
      [84e-10, 1.79540573407, 5429.8794682394],
      [778e-11, 6.17703744517, 38.1330356378],
      [776e-11, 4.09859968447, 14.2270940016],
      [1068e-11, 4.64209577648, 43232.3066584156],
      [954e-11, 1.49985885818, 1162.4747044078],
      [907e-11, 0.86986870809, 10344.2950653858],
      [931e-11, 4.06049877517, 28766.924424484],
      [739e-11, 5.04368192034, 639.897286314],
      [965e-11, 3.44286716197, 1589.0728952838],
      [763e-11, 5.86304776787, 16858.4825329332],
      [953e-11, 4.20801492835, 11190.377900137],
      [708e-11, 1.72432323967, 13095.8426650774],
      [969e-11, 1.64437243011, 29088.811415985],
      [717e-11, 0.16688678895, 11.729352836],
      [962e-11, 3.53101876172, 12416.5885028482],
      [745e-11, 5.77741082302, 12592.4500197826],
      [672e-11, 1.91091228744, 3.9321532631],
      [671e-11, 5.46240758839, 18052.9295431578],
      [675e-11, 6.28311649798, 4535.0594369244],
      [684e-11, 0.39975011401, 5849.3641121146],
      [799e-11, 0.29859056777, 12132.439962106],
      [758e-11, 0.96370719224, 1052.2683831884],
      [782e-11, 5.33875702541, 13517.8701062334],
      [73e-10, 1.70114998543, 17267.26820169119],
      [749e-11, 2.59607005624, 11609.8625440122],
      [734e-11, 2.7842049778, 640.8776073822],
      [688e-11, 5.15097673557, 16496.3613962024],
      [77e-10, 1.62459252416, 4701.1165017084],
      [633e-11, 2.20588443066, 25934.1243310894],
      [76e-10, 4.21317219403, 377.3736079158],
      [584e-11, 2.13420121623, 10557.5941608238],
      [572e-11, 0.24649745829, 9779.1086761254],
      [573e-11, 3.16435264609, 533.2140834436],
      [685e-11, 3.19344289472, 12146.6670561076],
      [675e-11, 0.96179234176, 10454.5013866052],
      [648e-11, 1.46327342554, 6268.8487559898],
      [589e-11, 2.50543543638, 3097.88382272579],
      [551e-11, 5.28106257475, 9388.0059094152],
      [696e-11, 3.6534215555, 4804.209275927],
      [669e-11, 2.5103005926, 2388.8940204492],
      [55e-10, 0.06883090057, 20199.094959633],
      [629e-11, 4.13350997495, 45892.73043315699],
      [678e-11, 6.09190163533, 135.62532501],
      [593e-11, 1.50129499103, 226858.23855437007],
      [542e-11, 3.58582033525, 6148.010769956],
      [599e-11, 6.12058050643, 18875.525869774],
      [682e-11, 5.0221361683, 17253.04110768959],
      [565e-11, 4.29309214275, 11933.3679606696],
      [486e-11, 0.77746204893, 27.4015560968],
      [503e-11, 0.58974557727, 15671.0817594066],
      [616e-11, 4.06539884128, 227.476132789],
      [537e-11, 2.15064382406, 21954.15760939799],
      [669e-11, 6.06995500278, 47162.5163546352],
      [54e-10, 2.83444221432, 5326.7866940208],
      [474e-11, 0.40346826846, 6915.8595893046],
      [532e-11, 5.26131065063, 10988.808157535],
      [582e-11, 3.24533095664, 153.7788104848],
      [641e-11, 3.24711790399, 2107.0345075424],
      [619e-11, 3.08302108547, 33019.0211122046],
      [466e-11, 3.14982369789, 10440.2742926036],
      [466e-11, 0.90708835651, 5966.6839803348],
      [528e-11, 0.8192645447, 813.5502839598],
      [603e-11, 3.81378921927, 316428.22867391503],
      [559e-11, 1.8189498573, 17996.0311682222],
      [437e-11, 2.28631745987, 6303.8512454838],
      [518e-11, 4.86068318058, 20597.2439630412],
      [424e-11, 6.23520018697, 6489.2613984286],
      [518e-11, 6.17617826756, 0.2438174835],
      [404e-11, 5.72804304258, 5642.1982426092],
      [458e-11, 1.34117773914, 6287.0080032545],
      [548e-11, 5.6845445832, 155427.542936241],
      [547e-11, 1.03391472434, 3646.3503773544],
      [428e-11, 4.6980968782, 846.0828347512],
      [413e-11, 6.0252069939, 6279.4854213396],
      [534e-11, 3.03030638223, 66567.48586525429],
      [383e-11, 1.4905558804, 19800.9459562248],
      [411e-11, 5.28384176408, 18451.07854656599],
      [352e-11, 4.68891600525, 4907.3020501456],
      [48e-10, 5.36572651091, 348.924420448],
      [344e-11, 5.89157452889, 6546.1597733642],
      [34e-10, 0.37557440365, 13119.72110282519],
      [434e-11, 4.98417856239, 6702.5604938666],
      [332e-11, 2.6890934443, 29296.6153895786],
      [448e-11, 2.16478480251, 5905.7022420756],
      [344e-11, 2.06546633735, 49.7570254718],
      [315e-11, 1.24023810969, 4061.2192153944],
      [324e-11, 2.30897526929, 5017.508371365],
      [413e-11, 0.17171692945, 6286.6662786432],
      [431e-11, 3.8660110138, 12489.8856287072],
      [349e-11, 4.55372493131, 4933.2084403326],
      [323e-11, 0.41971136084, 10770.8932562618],
      [341e-11, 2.68612860807, 11.0457002639],
      [316e-11, 3.52966641606, 17782.7320727842],
      [315e-11, 5.63357264999, 568.8218740274],
      [34e-10, 3.83571212349, 10660.6869350424],
      [296e-11, 0.62703270489, 20995.3929664494],
      [405e-11, 1.00084965393, 16460.33352952499],
      [414e-11, 1.21998752076, 51092.7260508548],
      [336e-11, 4.71465945215, 6179.9830757728],
      [361e-11, 3.71235613733, 28237.2334593894],
      [327e-11, 1.05606504715, 11919.140866668],
      [327e-11, 6.1422242098, 6254.6266625236],
      [268e-11, 2.47224339737, 664.75604513],
      [269e-11, 1.86210872453, 23141.5583829246],
      [345e-11, 0.93461290184, 6058.7310542895],
      [353e-11, 4.50033650657, 36949.2308084242],
      [344e-11, 6.26166140367, 24356.7807886416],
      [3e-9, 4.46964001975, 6418.1409300268],
      [26e-10, 4.04967464725, 6525.8044539654],
      [298e-11, 2.20018811054, 156137.47598479927],
      [253e-11, 3.49930797865, 29864.334027309],
      [254e-11, 2.44883530154, 5331.3574437408],
      [296e-11, 0.84341183907, 5729.506447149],
      [241e-11, 2.00721298729, 16737.5772365966],
      [311e-11, 1.23668016336, 6281.5913772831],
      [332e-11, 3.55576945724, 7668.6374249425],
      [236e-11, 2.47437156031, 6245.0481773556],
      [264e-11, 4.43924412283, 12964.300703391],
      [257e-11, 1.79654471948, 11080.1715789176],
      [26e-10, 3.3307759606, 5888.4499649322],
      [285e-11, 0.3088636143, 11823.1616394502],
      [29e-10, 5.70141882483, 77.673770428],
      [255e-11, 4.00939662024, 5881.4037282342],
      [253e-11, 4.73318512715, 16723.350142595],
      [228e-11, 0.95333661324, 5540.0857894588],
      [281e-11, 1.29199646396, 22805.7355659936],
      [319e-11, 1.38633229189, 163096.18036118348],
      [224e-11, 1.65156322696, 10027.9031957292],
      [226e-11, 0.34125379653, 17796.9591667858],
      [236e-11, 4.19817431922, 19.66976089979],
      [281e-11, 4.14114899916, 12539.853380183],
      [275e-11, 5.50306930248, 32.5325507914],
      [223e-11, 5.23334210294, 56.8983749356],
      [217e-11, 6.08598789777, 6805.6532680852],
      [228e-11, 5.17114391778, 11720.0688652316],
      [274e-11, 4.50716805713, 6016.4688082696],
      [245e-11, 3.96486270306, 22.7752014508],
      [22e-10, 4.7207808197, 6.62855890001],
      [207e-11, 5.71701403951, 41.5507909848],
      [204e-11, 3.9122741125, 2699.7348193176],
      [209e-11, 0.86881969024, 6321.1035226272],
      [2e-9, 2.11984442601, 4274.5183108324],
      [2e-9, 5.39839888151, 6019.9919266186],
      [209e-11, 5.67606291663, 11293.4706743556],
      [252e-11, 1.6496572935, 9380.9596727172],
      [275e-11, 5.04826903506, 73.297125859],
      [208e-11, 1.88207277133, 11300.5842213564],
      [206e-11, 5.0728488933, 6277.552925684],
      [272e-11, 0.74640924904, 1975.492545856],
      [199e-11, 3.30813142103, 22743.4093795164],
      [269e-11, 4.48560812155, 64471.99124174489],
      [192e-11, 2.17463565107, 5863.5912061162],
      [228e-11, 5.85373115869, 128.0188433374],
      [261e-11, 2.64321183295, 55022.9357470744],
      [196e-11, 2.4853762232, 16062.1845261168],
      [187e-11, 1.3189176028, 29826.3063546732],
      [22e-10, 5.75012110079, 29.429508536],
      [187e-11, 4.03230554718, 467.9649903544],
      [2e-9, 5.60555262896, 1066.49547719],
      [231e-11, 1.09802712785, 12341.8069042809],
      [198e-11, 0.29474229005, 149.5631971346],
      [249e-11, 5.1047702317, 7875.6718636242],
      [179e-11, 0.87066197995, 12721.572099417],
      [203e-11, 1.56914310573, 28286.9904848612],
      [198e-11, 3.54061588502, 30.914125635],
      [171e-11, 3.45366018621, 5327.4761083828],
      [183e-11, 0.72325421604, 6272.0301497275],
      [216e-11, 2.97175184412, 19402.7969528166],
      [168e-11, 2.51559879907, 23937.856389741],
      [195e-11, 0.09045393425, 156.4007205024],
      [216e-11, 0.42162375972, 23539.7073863328],
      [189e-11, 0.37542530191, 9814.6041002912],
      [207e-11, 2.01752547259, 238004.5241572363],
      [218e-11, 2.36835893645, 16627.3709153772],
      [166e-11, 4.23182960518, 16840.67001081519],
      [2e-9, 2.02153258098, 16097.6799502826],
      [169e-11, 0.91318727, 95.9792272178],
      [211e-11, 5.73370637657, 151.8972810852],
      [204e-11, 0.42643085174, 515.463871093],
      [212e-11, 3.00223140894, 12043.574281889],
      [192e-11, 5.46153589821, 6379.0550772092],
      [16e-10, 6.23798383332, 202.2533951741],
      [215e-11, 0.20889073407, 5621.8429232104],
      [15e-10, 3.12999753018, 799.8211251654],
      [187e-11, 2.12345787867, 491.6632924588],
      [192e-11, 1.33928820063, 394.6258850592],
      [149e-11, 2.65697593276, 21.335640467],
      [146e-11, 5.58021191726, 412.3710968744],
      [156e-11, 3.7565767638, 12323.4230960088],
      [143e-11, 3.28248547724, 29.8214381488],
      [144e-11, 1.07862546598, 1265.5674786264],
      [148e-11, 0.2338663109, 10021.8372800994],
      [164e-11, 0.94288727597, 14919.0178537546],
      [193e-11, 5.92751083827, 40879.4405046438],
      [14e-10, 4.97612440269, 158.9435177832],
      [148e-11, 2.61651818006, 17157.0618804718],
      [14e-10, 3.66947933935, 26084.0218062162],
      [147e-11, 5.09968173403, 661.232926781],
      [147e-11, 1.36976712162, 4171.4255366138],
      [134e-11, 4.79432636012, 111.1866422876],
      [14e-10, 1.27748013377, 107.6635239386],
      [171e-11, 2.77586207403, 26735.9452622132],
      [183e-11, 5.43418358741, 369.6998159404],
      [134e-11, 3.09132862833, 17.812522118],
      [132e-11, 3.05633896779, 22490.9621214934],
      [181e-11, 4.22950689891, 966.9708774356],
      [166e-11, 3.67660435776, 15508.6151232744],
      [152e-11, 5.28885813387, 12669.2444742014],
      [15e-10, 5.86819430895, 97238.62754448749],
      [145e-11, 5.07330784304, 87.30820453981],
      [133e-11, 5.65471067133, 31.9723058168],
      [124e-11, 2.83326216907, 12566.2190102856],
      [14e-10, 5.84212721453, 22476.73502749179],
      [134e-11, 3.12858101887, 32217.2001810808],
      [137e-11, 0.86487461904, 9924.8104215106],
      [172e-11, 1.98369595114, 174242.4659640497],
      [17e-10, 4.41115280254, 327574.51427678124],
      [128e-11, 4.49087631612, 31415.379249957],
      [151e-11, 0.46542092001, 39609.6545831656],
      [153e-11, 3.78801830344, 17363.24742890899],
      [165e-11, 5.31654110459, 16943.7627850338],
      [165e-11, 4.06747587817, 58953.145443294],
      [118e-11, 0.63846333239, 6.0659156298],
      [159e-11, 0.86086959274, 221995.02880149524],
      [119e-11, 5.96432932413, 1385.8952763362],
      [114e-11, 5.16516114595, 25685.872802808],
      [112e-11, 4.92889233335, 56.8032621698],
      [119e-11, 2.40626699328, 18635.9284545362],
      [115e-11, 0.23374479051, 418.9243989006],
      [113e-11, 2.7938757674, 6272.4391846416],
      [122e-11, 0.936940724, 24492.40611365159],
      [133e-11, 4.87155573413, 22345.2603761082],
      [113e-11, 3.80362889046, 6293.7125153412],
      [13e-10, 3.72996018683, 12573.2652469836],
      [107e-11, 3.40227152756, 21393.5419698576],
      [122e-11, 1.00385670948, 95143.1329209781],
      [14e-10, 1.094130757, 44809.6502008634],
      [112e-11, 6.05462382871, 433.7117378768],
      [123e-11, 4.55640196386, 239424.39025435288],
      [104e-11, 1.54931540602, 127.9515330346],
      [111e-11, 3.04186517428, 8982.810669309],
      [102e-11, 4.12448497391, 15664.03552270859],
      [107e-11, 4.67919356465, 77690.75950573849],
      [118e-11, 4.5232017012, 19004.6479494084],
      [107e-11, 5.71774478555, 77736.78343050249],
      [103e-11, 4.79332126649, 33794.5437235286],
      [143e-11, 1.81201813018, 4214.0690150848],
      [102e-11, 3.7581778657, 58864.5439181463],
      [125e-11, 1.14419195615, 625.6701923124],
      [124e-11, 3.27736513892, 12566.08438968],
      [11e-10, 1.08705709966, 2787.0430238574],
      [102e-11, 4.75119578149, 12242.6462833254],
      [101e-11, 4.91289409429, 401.6721217572],
      [138e-11, 2.89578979744, 9411.4646150872],
      [129e-11, 1.23516042371, 12029.3471878874],
      [138e-11, 2.45654707076, 7576.560073574],
      [98e-11, 5.4477176502, 29026.48522950779],
      [134e-11, 1.43105174912, 86464.6133168312],
      [108e-11, 0.9898977494, 5636.0650166766],
      [117e-11, 5.17362847134, 34520.3093093808],
      [97e-11, 3.34717130592, 16310.9790457206],
      [107e-11, 2.94547931851, 24602.61243487099],
      [98e-11, 4.37041908717, 34513.2630726828],
      [125e-11, 2.72182830814, 24065.80792277559],
      [111e-11, 0.58899131543, 6303.4311693902],
      [102e-11, 0.66938025772, 10239.5838660108],
      [119e-11, 1.21666517886, 1478.8665740644],
      [111e-11, 1.04321934681, 16522.6597160022],
      [94e-11, 4.31076339857, 26880.3198130326],
      [98e-11, 4.14248433763, 6599.467719648],
      [95e-11, 2.89807657534, 34911.412076091],
      [97e-11, 0.89642320201, 71980.63357473118],
      [95e-11, 0.65717727948, 6288.5987742988],
      [116e-11, 4.19967201116, 206.7007372966],
      [95e-11, 1.78315464297, 18139.2945014159],
      [99e-11, 1.37437847718, 1039.0266107904],
      [126e-11, 3.21642544972, 305281.9430710488],
      [94e-11, 0.6899503186, 7834.1210726394],
      [95e-11, 5.58111421744, 3104.9300594238],
      [108e-11, 0.52696637156, 276.7457718644],
      [124e-11, 3.43899862683, 172146.9713405403],
      [87e-11, 1.18764938806, 18842.11400297339],
      [87e-11, 0.09094166389, 15141.390794312],
      [108e-11, 1.03363414379, 82576.9812209953],
      [119e-11, 2.86729109648, 90394.82301305079],
      [104e-11, 3.39218586218, 290.972865866],
      [94e-11, 5.68284937444, 32367.0976562076],
      [117e-11, 0.78475956902, 83286.91426955358],
      [105e-11, 3.96551057233, 6357.8574485587],
      [94e-11, 4.03443174853, 13341.6743113068],
      [96e-11, 0.92742567538, 1062.9050485382],
      [89e-11, 4.45371820659, 792.7748884674],
      [87e-11, 0.40013481685, 90279.92316810328],
      [113e-11, 2.48165313368, 48739.859897083],
      [87e-11, 3.43122851097, 27707.5424942948],
      [101e-11, 5.32081603011, 2301.58581590939],
      [84e-11, 0.67020912458, 28628.3362260996],
      [82e-11, 0.87060089842, 10241.2022911672],
      [86e-11, 4.6206479229, 36147.4098773004],
      [8e-10, 4.77649625396, 6819.8803620868],
      [95e-11, 2.87032913492, 23020.65308658799],
      [107e-11, 5.77864921649, 34115.1140692746],
      [11e-10, 3.32898859416, 72140.6286666874],
      [87e-11, 4.40657711727, 142.1786270362],
      [103e-11, 4.2250672681, 30666.1549584328],
      [82e-11, 3.89404392552, 5547.1993364596],
      [109e-11, 1.94546065204, 24279.10701821359],
      [87e-11, 4.32472045435, 742.9900605326],
      [107e-11, 4.91580912547, 277.0349937414],
      [88e-11, 2.10180817713, 26482.1708096244],
      [86e-11, 4.01895021483, 12491.3701014155],
      [106e-11, 5.49092372854, 62883.3551395136],
      [8e-10, 6.1978570495, 6709.6740408674],
      [105e-11, 2.44166529175, 6298.3283211764],
      [83e-11, 4.90662164029, 51.28033786241],
      [74e-11, 2.34622575625, 7018.9523635232],
      [78e-11, 6.06947270265, 148434.53403769128],
      [79e-11, 3.03048221644, 838.9692877504],
      [73e-11, 3.05008665738, 567.7186377304],
      [102e-11, 3.59223815483, 22380.755800274],
      [84e-11, 0.46604373274, 45.1412196366],
      [92e-11, 4.12917744733, 18216.443810661],
      [91e-11, 0.49382398887, 6453.7487206106],
      [73e-11, 1.72446569088, 21424.4666443034],
      [69e-11, 1.4937267773, 21548.9623692918],
      [69e-11, 4.73181018058, 8858.3149443206],
      [77e-11, 0.47683782532, 11520.9968637952],
      [78e-11, 5.4394263099, 15265.8865193004],
      [77e-11, 2.53773750372, 76.2660712756],
      [69e-11, 2.53932635192, 9910.583327509],
      [75e-11, 0.1559472921, 23006.42599258639],
      [78e-11, 2.41004950269, 6393.2821712108],
      [67e-11, 5.05152846816, 57375.8019008462],
      [77e-11, 3.9107560486, 24383.0791084414],
      [67e-11, 0.78239147387, 12779.4507954208],
      [71e-11, 1.24817900687, 10419.9862835076],
      [67e-11, 5.7785122776, 6311.5250374592],
      [61e-11, 2.66705754411, 18852.7506683232],
      [79e-11, 1.89137330427, 6528.9074962208],
      [84e-11, 5.11523704221, 50317.2034395308],
      [59e-11, 3.38290426621, 35707.7100829074],
      [65e-11, 4.66767908854, 26709.6469424134],
      [79e-11, 5.59773848156, 71960.38658322369],
      [61e-11, 3.30733768968, 18845.7044316252],
      [57e-11, 3.90831298022, 5999.2165311262],
      [58e-11, 3.92572820333, 30348.883772767],
      [61e-11, 0.05695045822, 7856.89627409019],
      [61e-11, 5.63297960691, 7863.9425107882],
      [68e-11, 2.53986117507, 20452.8694122218],
      [53e-11, 5.44021645443, 32370.9789915656],
      [59e-11, 4.95695131145, 11925.2740926006],
      [59e-11, 5.34668243273, 137288.2484348251],
      [56e-11, 4.05779957425, 17892.93839400359],
      [53e-11, 3.94182462468, 18624.8827542723],
      [49e-11, 2.11782803206, 22594.05489571199],
      [62e-11, 2.47154086715, 12345.739057544],
      [49e-11, 5.7659693738, 18606.4989460002],
      [52e-11, 6.20902099741, 21947.1113727],
      [51e-11, 3.13287981215, 33326.5787331742],
      [57e-11, 6.17003357597, 61306.0115970658],
      [64e-11, 5.66596451842, 34596.3646546524],
      [66e-11, 3.922623355, 69853.3520756813],
      [53e-11, 5.51119362049, 77710.24834977149],
      [53e-11, 4.88573986965, 77717.29458646949],
      [48e-11, 2.71399112516, 20760.4270331914],
      [46e-11, 6.08376164442, 29822.7832363242],
      [52e-11, 0.3139748138, 37724.7534197482],
      [45e-11, 5.53587248663, 6262.7205305926],
      [59e-11, 2.45437896854, 69166.430989505],
      [6e-10, 5.24261569842, 56600.2792895222],
      [51e-11, 6.15794342172, 11616.976091013],
      [6e-10, 1.74758109828, 44034.1275895394],
      [49e-11, 5.08973141046, 33990.6183442862],
      [44e-11, 3.28270864884, 29424.634232916],
      [52e-11, 5.34866947943, 28313.288804661],
      [59e-11, 2.12384971916, 36173.7081971002],
      [5e-10, 0.46480931695, 25287.7237993998],
      [44e-11, 2.0550351721, 63658.8777508376],
      [44e-11, 1.71009200258, 13362.4497067992],
      [41e-11, 3.91721318316, 6279.1945146334],
      [42e-11, 1.52106001448, 23550.34405168259],
      [42e-11, 3.10938258068, 84672.47584450469],
      [41e-11, 3.78863023321, 35050.00027447539],
      [42e-11, 5.57543459263, 38500.2760310722],
      [4e-10, 5.55145719363, 12565.1713789146],
      [54e-11, 0.889354921, 50290.905119731],
      [55e-11, 2.50268487636, 77828.671313068],
      [54e-11, 4.16257918787, 22910.44676536859],
      [41e-11, 2.32141215064, 6286.9571853494],
      [45e-11, 3.18590576311, 45585.1728121874],
      [45e-11, 2.24348941683, 23646.32327890039],
      [43e-11, 3.8789211095, 6549.6828917132],
      [48e-11, 2.11364139445, 31570.7996493912],
      [43e-11, 5.55099558987, 12359.9661515456],
      [41e-11, 4.88191569433, 23536.11695768099],
      [49e-11, 2.44790922235, 13613.804277336],
      [47e-11, 3.5818169391, 4797.0957289262]
    ],
    "1": [
      [6283.0758499914, 0, 0],
      [0.00206058863, 2.67823455808, 6283.0758499914],
      [4303419e-11, 2.63512233481, 12566.1516999828],
      [425264e-11, 1.59046982018, 3.523118349],
      [109017e-11, 2.96631010675, 1577.3435424478],
      [93479e-11, 2.59211109542, 18849.2275499742],
      [119305e-11, 5.79555765566, 26.2983197998],
      [72121e-11, 1.13840581212, 529.6909650946],
      [67784e-11, 1.87453300345, 398.1490034082],
      [6735e-10, 4.40932832004, 5507.5532386674],
      [59045e-11, 2.88815790631, 5223.6939198022],
      [55976e-11, 2.17471740035, 155.4203994342],
      [45411e-11, 0.39799502896, 796.2980068164],
      [36298e-11, 0.46875437227, 775.522611324],
      [28962e-11, 2.64732254645, 7.1135470008],
      [19097e-11, 1.84628376049, 5486.777843175],
      [20844e-11, 5.34138275149, 0.9803210682],
      [18508e-11, 4.96855179468, 213.299095438],
      [16233e-11, 0.03216587315, 2544.3144198834],
      [17293e-11, 2.9911676063, 6275.9623029906],
      [15832e-11, 1.43049301283, 2146.1654164752],
      [14608e-11, 1.2046979369, 10977.078804699],
      [11877e-11, 3.25805082007, 5088.6288397668],
      [11514e-11, 2.07502080082, 4694.0029547076],
      [9721e-11, 4.2392586526, 1349.8674096588],
      [9969e-11, 1.30263423409, 6286.5989683404],
      [9452e-11, 2.69956827011, 242.728603974],
      [12461e-11, 2.83432282119, 1748.016413067],
      [11808e-11, 5.27379760438, 1194.4470102246],
      [8577e-11, 5.6447608598, 951.7184062506],
      [10641e-11, 0.76614722966, 553.5694028424],
      [7576e-11, 5.30056172859, 2352.8661537718],
      [5764e-11, 1.77228445837, 1059.3819301892],
      [6385e-11, 2.65034514038, 9437.762934887],
      [5223e-11, 5.66135782131, 71430.69561812909],
      [5315e-11, 0.91110018969, 3154.6870848956],
      [6101e-11, 4.66633726278, 4690.4798363586],
      [4335e-11, 0.23934560382, 6812.766815086],
      [5041e-11, 1.42489704722, 6438.4962494256],
      [4259e-11, 0.77355543889, 10447.3878396044],
      [52e-9, 1.85528830215, 801.8209311238],
      [3744e-11, 2.00119905572, 8031.0922630584],
      [3553e-11, 2.42789590229, 14143.4952424306],
      [3372e-11, 3.86210786421, 1592.5960136328],
      [338e-10, 0.88545388924, 12036.4607348882],
      [3196e-11, 3.19713328141, 4705.7323075436],
      [3221e-11, 0.6160104899, 8429.2412664666],
      [4132e-11, 5.23992584671, 7084.8967811152],
      [297e-10, 6.07029819073, 4292.3308329504],
      [29e-9, 2.32464208411, 20.3553193988],
      [3504e-11, 4.79976712702, 6279.5527316424],
      [295e-10, 1.43108874817, 5746.271337896],
      [2697e-11, 4.80365209201, 7234.794256242],
      [2531e-11, 6.22289990904, 6836.6452528338],
      [2745e-11, 0.93466065396, 5760.4984318976],
      [325e-10, 3.39951915286, 7632.9432596502],
      [2278e-11, 5.00339914806, 17789.845619785],
      [2076e-11, 3.95551309007, 10213.285546211],
      [2061e-11, 2.2240771919, 5856.4776591154],
      [2252e-11, 5.67166717686, 11499.6562227928],
      [2148e-11, 5.20182663314, 11513.8833167944],
      [1886e-11, 0.53198539077, 3340.6124266998],
      [1875e-11, 4.73511969924, 83996.84731811189],
      [206e-10, 2.54985307819, 25132.3033999656],
      [1794e-11, 1.47435300254, 4164.311989613],
      [1778e-11, 3.02473091781, 5.5229243074],
      [2036e-11, 0.90908165072, 6256.7775301916],
      [2064e-11, 2.27051326957, 522.5774180938],
      [1773e-11, 3.03090500693, 5753.3848848968],
      [1569e-11, 6.12406216872, 5216.5803728014],
      [159e-10, 4.63713748247, 3.2863574178],
      [1533e-11, 4.20305593883, 13367.9726311066],
      [1427e-11, 1.19087535126, 3894.1818295422],
      [1376e-11, 4.24955891338, 426.598190876],
      [1375e-11, 3.09301252193, 135.0650800354],
      [1308e-11, 3.0849213889, 5643.1785636774],
      [134e-10, 5.76513167968, 6040.3472460174],
      [125e-10, 3.07748196332, 11926.2544136688],
      [1551e-11, 3.07664090662, 6681.2248533996],
      [1148e-11, 3.24144202282, 12168.0026965746],
      [1268e-11, 2.09201189992, 6290.1893969922],
      [1248e-11, 3.44506939791, 536.8045120954],
      [1118e-11, 2.31830078762, 16730.4636895958],
      [1105e-11, 5.31966001019, 23.8784377478],
      [1012e-11, 3.74953487087, 7860.4193924392],
      [1025e-11, 2.4468377161, 1990.745017041],
      [962e-11, 0.81771017882, 3.881335358],
      [911e-11, 0.41724352112, 7079.3738568078],
      [1091e-11, 3.98233608618, 11506.7697697936],
      [957e-11, 4.07671436153, 6127.6554505572],
      [835e-11, 5.28348689371, 11790.6290886588],
      [802e-11, 3.88779080089, 10973.55568635],
      [773e-11, 2.41044394817, 1589.0728952838],
      [758e-11, 1.30034365873, 103.0927742186],
      [749e-11, 4.96281442361, 6496.3749454294],
      [765e-11, 3.36312388424, 36.0278666774],
      [915e-11, 5.41549763095, 206.1855484372],
      [776e-11, 2.57589060224, 11371.7046897582],
      [772e-11, 3.98363364977, 955.5997416086],
      [749e-11, 5.17900231417, 10969.9652576982],
      [806e-11, 0.34226117299, 9917.6968745098],
      [728e-11, 5.20962563787, 38.0276726358],
      [685e-11, 2.77592961854, 20.7753954924],
      [636e-11, 4.28242193632, 28.4491874678],
      [608e-11, 5.63278510221, 10984.1923516998],
      [704e-11, 5.60739437733, 3738.761430108],
      [685e-11, 0.38876148682, 15.252471185],
      [601e-11, 0.73489602442, 419.4846438752],
      [716e-11, 2.65286869987, 6309.3741697912],
      [584e-11, 5.54508741381, 17298.1823273262],
      [628e-11, 1.11733054796, 7058.5984613154],
      [688e-11, 2.59684132401, 3496.032826134],
      [485e-11, 0.44470714066, 12352.8526045448],
      [562e-11, 2.82510352358, 3930.2096962196],
      [597e-11, 5.27675789973, 10575.4066829418],
      [583e-11, 3.1893153986, 4732.0306273434],
      [526e-11, 5.01737745304, 5884.9268465832],
      [54e-10, 1.29182747488, 640.8776073822],
      [481e-11, 5.49721461067, 5230.807466803],
      [406e-11, 5.21253018484, 220.4126424388],
      [395e-11, 1.87489912123, 16200.7727245012],
      [367e-11, 0.88533542945, 6283.14316029419],
      [369e-11, 3.84778078192, 18073.7049386502],
      [379e-11, 0.37991716505, 10177.2576795336],
      [356e-11, 3.84152910109, 11712.9553182308],
      [374e-11, 5.01577520608, 7.046236698],
      [381e-11, 4.30250406634, 6062.6632075526],
      [471e-11, 0.86388942467, 6069.7767545534],
      [367e-11, 1.3294383993, 6283.0085396886],
      [46e-10, 5.19667219582, 6284.0561710596],
      [333e-11, 5.54250425107, 4686.8894077068],
      [341e-11, 4.36524495363, 7238.6755916],
      [336e-11, 4.00205876835, 3097.88382272579],
      [359e-11, 6.22679790284, 245.8316462294],
      [307e-11, 2.35299010924, 170.6728706192],
      [343e-11, 3.77164927142, 6076.8903015542],
      [296e-11, 5.44138799494, 17260.1546546904],
      [328e-11, 0.13817705132, 11015.1064773348],
      [269e-11, 1.13308244952, 12569.6748183318],
      [263e-11, 0.0055073751, 4136.9104335162],
      [282e-11, 5.04399588559, 7477.522860216],
      [28e-10, 3.13703211405, 12559.038152982],
      [259e-11, 0.93882269388, 5642.1982426092],
      [292e-11, 1.98426314297, 12132.439962106],
      [247e-11, 3.84244798673, 5429.8794682394],
      [319e-11, 5.0417014879, 90617.7374312997],
      [245e-11, 5.70469737024, 65147.6197681377],
      [318e-11, 1.35581968834, 78051.5857313169],
      [241e-11, 0.99469787369, 3634.6210245184],
      [246e-11, 3.06168069393, 110.2063212194],
      [239e-11, 6.11854529589, 11856.2186514245],
      [267e-11, 0.65297608414, 21228.3920235458],
      [262e-11, 1.51070507866, 12146.6670561076],
      [23e-10, 1.75923794017, 9779.1086761254],
      [223e-11, 2.00967043606, 6172.869528772],
      [246e-11, 1.10411690861, 6282.0955289232],
      [214e-11, 4.03840492266, 14314.1681130498],
      [212e-11, 2.13695623228, 5849.3641121146],
      [207e-11, 3.07724246401, 11.729352836],
      [207e-11, 6.10303325026, 23543.23050468179],
      [266e-11, 1.00720021877, 2388.8940204492],
      [217e-11, 6.27840212312, 17267.26820169119],
      [231e-11, 5.37372783468, 13916.0191096416],
      [204e-11, 2.34615348695, 266.6070417218],
      [195e-11, 5.55015549753, 6133.5126528568],
      [203e-11, 4.65616806503, 24072.9214697764],
      [188e-11, 2.52682282169, 6525.8044539654],
      [177e-11, 1.73426919199, 154717.6098876827],
      [187e-11, 4.76501318048, 4535.0594369244],
      [186e-11, 4.63080493407, 10440.2742926036],
      [183e-11, 3.20060840641, 8635.9420037632],
      [172e-11, 1.45551703877, 9225.539273283],
      [162e-11, 3.30665137166, 639.897286314],
      [168e-11, 2.17671416605, 27.4015560968],
      [16e-10, 1.6816871275, 15110.4661198662],
      [194e-11, 2.79243768345, 7342.4577801806],
      [183e-11, 0.56273524797, 13517.8701062334],
      [172e-11, 5.97039514134, 4701.1165017084],
      [179e-11, 3.58450811616, 87.30820453981],
      [152e-11, 2.84070476839, 5650.2921106782],
      [156e-11, 1.07156076421, 18319.5365848796],
      [182e-11, 0.44053620124, 17253.04110768959],
      [142e-11, 1.4629013752, 11087.2851259184],
      [131e-11, 5.40912137746, 2699.7348193176],
      [144e-11, 2.07312089638, 25158.6017197654],
      [147e-11, 6.15107800602, 9623.6882766912],
      [141e-11, 5.55739979498, 10454.5013866052],
      [135e-11, 0.0609812943, 16723.350142595],
      [123e-11, 5.81194797368, 17256.6315363414],
      [124e-11, 2.36269386269, 4933.2084403326],
      [126e-11, 3.47483886466, 22483.84857449259],
      [159e-11, 5.63944722033, 5729.506447149],
      [137e-11, 1.93811728826, 20426.571092422],
      [123e-11, 3.92815962825, 17996.0311682222],
      [148e-11, 3.02542567608, 1551.045222648],
      [121e-11, 0.05537321071, 13095.8426650774],
      [12e-10, 5.91904349732, 6206.8097787158],
      [134e-11, 3.11122937825, 21954.15760939799],
      [119e-11, 5.52143897201, 709.9330485583],
      [122e-11, 3.00840036775, 19800.9459562248],
      [127e-11, 1.37534182407, 14945.3161735544],
      [141e-11, 2.56886299638, 1052.2683831884],
      [123e-11, 2.83671175442, 11919.140866668],
      [118e-11, 0.81918292547, 5331.3574437408],
      [151e-11, 2.68728567951, 11769.8536931664],
      [119e-11, 5.08654046247, 5481.2549188676],
      [113e-11, 4.42675663942, 18422.62935909819],
      [153e-11, 2.46021790779, 11933.3679606696],
      [108e-11, 1.04936452151, 11403.676995575],
      [128e-11, 0.99810456461, 8827.3902698748],
      [144e-11, 2.54869747042, 227.476132789],
      [15e-10, 4.50631437136, 2379.1644735716],
      [109e-11, 0.29269062317, 16737.5772365966],
      [122e-11, 4.23040027813, 29.429508536],
      [111e-11, 5.16970710025, 17782.7320727842],
      [105e-11, 1.61738153441, 13119.72110282519],
      [1e-9, 3.52204690579, 18052.9295431578],
      [108e-11, 1.08493117155, 16858.4825329332],
      [135e-11, 3.2016061697, 6262.300454499],
      [106e-11, 1.96085069786, 74.7815985673],
      [129e-11, 4.85949366504, 16496.3613962024],
      [11e-10, 2.30605777952, 16460.33352952499],
      [97e-11, 3.5091894021, 5333.9002410216],
      [99e-11, 3.56417337974, 735.8765135318],
      [96e-11, 3.40918487598, 15720.8387848784],
      [94e-11, 5.01601027363, 3128.3887650958],
      [97e-11, 1.65579893894, 533.2140834436],
      [92e-11, 0.89219199493, 29296.6153895786],
      [123e-11, 3.16062062663, 9380.9596727172],
      [102e-11, 1.20493500565, 23020.65308658799],
      [88e-11, 2.21265504437, 12721.572099417],
      [89e-11, 1.5432266957, 20199.094959633],
      [121e-11, 6.19860353182, 9388.0059094152],
      [89e-11, 4.08082274765, 22805.7355659936],
      [98e-11, 1.09176668094, 12043.574281889],
      [86e-11, 1.13649001466, 143571.32428481648],
      [88e-11, 5.96980472191, 107.6635239386],
      [82e-11, 5.01561173481, 22003.9146348698],
      [94e-11, 1.69615700473, 23006.42599258639],
      [81e-11, 3.00664741995, 2118.7638603784],
      [98e-11, 1.39215287161, 8662.240323563],
      [8e-10, 5.16340988714, 17796.9591667858],
      [82e-11, 5.86893959287, 2787.0430238574],
      [77e-11, 0.80723694712, 167283.7615876655],
      [91e-11, 5.74902425304, 21424.4666443034],
      [76e-11, 5.67183650604, 14.2270940016],
      [81e-11, 6.16619455699, 1039.0266107904],
      [76e-11, 3.21449884756, 111.1866422876],
      [78e-11, 1.37531518377, 21947.1113727],
      [74e-11, 3.58814195051, 11609.8625440122],
      [77e-11, 4.84846488388, 22743.4093795164],
      [9e-10, 1.48869013606, 15671.0817594066],
      [82e-11, 3.48618398216, 29088.811415985],
      [71e-11, 2.2159156119, 12029.3471878874],
      [69e-11, 1.93625656075, 135.62532501],
      [7e-10, 2.66552760898, 18875.525869774],
      [69e-11, 5.41478093731, 26735.9452622132],
      [79e-11, 5.15158156951, 12323.4230960088],
      [78e-11, 4.17014063638, 1066.49547719],
      [65e-11, 5.64584720343, 12139.5535091068],
      [71e-11, 3.89804774037, 22779.4372461938],
      [63e-11, 4.53968787714, 8982.810669309],
      [76e-11, 3.29088891716, 2942.4634232916],
      [69e-11, 0.94232113005, 14919.0178537546],
      [63e-11, 4.0918653549, 16062.1845261168],
      [65e-11, 3.34580407184, 51.28033786241],
      [65e-11, 5.75757544877, 52670.0695933026],
      [57e-11, 5.25050277534, 20995.3929664494],
      [61e-11, 1.92290673861, 6805.6532680852],
      [61e-11, 0.08878901558, 13362.4497067992],
      [76e-11, 1.86947679415, 25287.7237993998],
      [56e-11, 4.25396542622, 6709.6740408674],
      [58e-11, 4.79429715781, 6286.3622074092],
      [73e-11, 0.53299090807, 2301.58581590939],
      [7e-10, 4.31243357502, 19402.7969528166],
      [67e-11, 2.53852336668, 377.3736079158],
      [56e-11, 3.20816844695, 24889.5747959916],
      [54e-11, 5.17336469511, 26084.0218062162],
      [53e-11, 3.17675406016, 18451.07854656599],
      [53e-11, 3.61529270216, 77.673770428],
      [53e-11, 0.45467549335, 30666.1549584328],
      [53e-11, 2.97761644192, 21548.9623692918],
      [61e-11, 0.14805728543, 23013.5395395872],
      [51e-11, 3.32803972907, 56.8983749356],
      [52e-11, 3.41304011355, 23141.5583829246],
      [58e-11, 3.13638677202, 309.2783226558],
      [54e-11, 1.60896548545, 13341.6743113068],
      [53e-11, 5.81426394852, 16193.65917750039],
      [67e-11, 6.27917920454, 22345.2603761082],
      [5e-10, 0.42577644151, 25685.872802808],
      [48e-11, 0.70204553352, 1162.4747044078],
      [66e-11, 3.64350022359, 15265.8865193004],
      [5e-10, 5.7438291744, 19.66976089979],
      [54e-11, 1.97277370837, 23581.2581773176],
      [51e-11, 1.23713196525, 12539.853380183],
      [46e-11, 5.41431704639, 33019.0211122046],
      [46e-11, 4.80640843261, 19651.048481098],
      [5e-10, 1.23847511223, 22476.73502749179],
      [51e-11, 4.91913434178, 12592.4500197826],
      [46e-11, 2.41369976086, 98068.53671630539],
      [45e-11, 3.45227074337, 30774.5016425748],
      [45e-11, 4.39659083856, 433.7117378768],
      [45e-11, 3.71921056816, 18209.33026366019],
      [44e-11, 2.47683925106, 24356.7807886416],
      [49e-11, 2.17835058609, 13521.7514415914],
      [46e-11, 0.26142733448, 11.0457002639],
      [45e-11, 2.46230645202, 51868.2486621788],
      [43e-11, 4.29458463014, 28230.18722269139],
      [48e-11, 0.89551707131, 56600.2792895222],
      [42e-11, 3.63410684699, 4590.910180489],
      [49e-11, 3.17757670967, 6303.8512454838],
      [43e-11, 4.93350349236, 10021.8372800994],
      [52e-11, 3.65410195699, 7872.1487452752],
      [41e-11, 4.82166756935, 10988.808157535],
      [4e-10, 1.81891629936, 34596.3646546524],
      [43e-11, 1.94164978061, 1903.4368125012],
      [41e-11, 0.74461854136, 23937.856389741],
      [45e-11, 5.4557501753, 60530.4889857418],
      [5e-10, 5.67355640472, 18216.443810661],
      [4e-10, 0.04502010161, 38526.574350872],
      [53e-11, 3.64807615995, 11925.2740926006],
      [42e-11, 5.19292937193, 19004.6479494084],
      [41e-11, 0.94309683296, 9924.8104215106],
      [39e-11, 4.61184303844, 95.9792272178],
      [49e-11, 2.05532526216, 12573.2652469836],
      [45e-11, 3.73717824543, 7875.6718636242],
      [43e-11, 1.14078465002, 49.7570254718],
      [39e-11, 1.70539366023, 32217.2001810808],
      [37e-11, 1.29390383811, 310.8407988684],
      [38e-11, 0.9597092595, 664.75604513],
      [39e-11, 0.85957361635, 16522.6597160022],
      [4e-10, 1.00170796001, 36949.2308084242],
      [4e-10, 3.78164718776, 55798.4583583984],
      [37e-11, 5.42237070904, 6286.6662786432],
      [36e-11, 1.68167662194, 10344.2950653858],
      [4e-10, 5.13217319067, 15664.03552270859],
      [49e-11, 3.62741283878, 77713.7714681205],
      [45e-11, 6.15877872538, 28286.9904848612],
      [36e-11, 3.32158458257, 16207.886271502],
      [35e-11, 5.83917764292, 6321.1035226272],
      [36e-11, 1.80784164083, 6279.7894925736],
      [35e-11, 4.60279245362, 28237.2334593894],
      [33e-11, 0.47301775923, 18635.9284545362],
      [35e-11, 4.36571027474, 48739.859897083],
      [31e-11, 3.06828028412, 6819.8803620868],
      [31e-11, 2.4020319848, 28628.3362260996],
      [34e-11, 1.90096411242, 12964.300703391],
      [29e-11, 6.09291010354, 18606.4989460002],
      [28e-11, 3.42046112698, 6288.5987742988],
      [28e-11, 3.437361406, 34115.1140692746],
      [29e-11, 1.48920816078, 6489.2613984286],
      [28e-11, 3.07474749886, 29822.7832363242],
      [38e-11, 2.44608264663, 31415.379249957],
      [28e-11, 2.98392582088, 6277.552925684],
      [27e-11, 5.03556015623, 12779.4507954208],
      [27e-11, 5.40812977287, 26087.9031415742],
      [38e-11, 5.56439937893, 27832.0382192832],
      [26e-11, 3.87685883153, 6262.7205305926],
      [27e-11, 6.1556539284, 28759.81087748319],
      [25e-11, 5.17122153205, 6915.8595893046],
      [27e-11, 4.03132006944, 9910.583327509],
      [33e-11, 3.97763407373, 12410.7313005486],
      [24e-11, 5.31307120044, 29026.48522950779],
      [25e-11, 0.81055213297, 36173.7081971002],
      [24e-11, 1.2870610131, 24491.4257925834],
      [21e-11, 2.02548478742, 28766.924424484],
      [21e-11, 6.07545114034, 18139.2945014159],
      [22e-11, 2.31199937131, 6303.4311693902],
      [23e-11, 1.35235057478, 49515.382508407],
      [23e-11, 2.92765926961, 65236.2212932854],
      [19e-11, 0.03636659763, 29864.334027309],
      [2e-10, 0.91374066194, 45585.1728121874],
      [21e-11, 4.45003013294, 22490.9621214934],
      [22e-11, 1.97119365888, 34513.2630726828],
      [2e-10, 4.11682669951, 17157.0618804718],
      [24e-11, 1.40243942415, 14712.317116458],
      [22e-11, 2.19759737115, 31570.7996493912],
      [21e-11, 1.48739821208, 61306.0115970658],
      [25e-11, 5.71465573409, 25934.1243310894]
    ],
    "2": [
      [8721859e-11, 1.07253635559, 6283.0758499914],
      [99099e-10, 3.14159265359, 0],
      [294833e-11, 0.43717350256, 12566.1516999828],
      [27338e-11, 0.05295636147, 3.523118349],
      [16333e-11, 5.18820215724, 26.2983197998],
      [15745e-11, 3.68504712183, 155.4203994342],
      [9425e-11, 0.29667114694, 18849.2275499742],
      [8938e-11, 2.05706319592, 77713.7714681205],
      [694e-10, 0.82691541038, 775.522611324],
      [5061e-11, 4.6624323168, 1577.3435424478],
      [406e-10, 1.03067032318, 7.1135470008],
      [3464e-11, 5.14021224609, 796.2980068164],
      [3172e-11, 6.05479318507, 5507.5532386674],
      [302e-10, 1.19240008524, 242.728603974],
      [2885e-11, 6.11705865396, 529.6909650946],
      [3809e-11, 3.44043369494, 5573.1428014331],
      [2719e-11, 0.30363248164, 398.1490034082],
      [2365e-11, 4.37666117992, 5223.6939198022],
      [2538e-11, 2.27966434314, 553.5694028424],
      [2078e-11, 3.75435095487, 0.9803210682],
      [1675e-11, 0.90149951436, 951.7184062506],
      [1534e-11, 5.75895831192, 1349.8674096588],
      [1224e-11, 2.97285792195, 2146.1654164752],
      [1449e-11, 4.36401639552, 1748.016413067],
      [1341e-11, 3.72019379666, 1194.4470102246],
      [1253e-11, 2.9488872631, 6438.4962494256],
      [999e-11, 5.98665341008, 6286.5989683404],
      [917e-11, 4.79722195184, 5088.6288397668],
      [829e-11, 3.31021398862, 213.299095438],
      [1102e-11, 1.27094359244, 161000.6857376741],
      [764e-11, 3.41231607038, 5486.777843175],
      [1046e-11, 0.60374190029, 3154.6870848956],
      [887e-11, 5.23364022595, 7084.8967811152],
      [644e-11, 1.59974355582, 2544.3144198834],
      [681e-11, 3.42742947469, 4694.0029547076],
      [606e-11, 2.47688996663, 10977.078804699],
      [706e-11, 6.19369692903, 4690.4798363586],
      [643e-11, 1.98119869589, 801.8209311238],
      [502e-11, 1.44415463861, 6836.6452528338],
      [49e-10, 2.33889753806, 1592.5960136328],
      [458e-11, 1.30867922972, 4292.3308329504],
      [431e-11, 0.03542536476, 7234.794256242],
      [349e-11, 0.98779272263, 6040.3472460174],
      [385e-11, 1.57065592218, 71430.69561812909],
      [371e-11, 3.16149051601, 6309.3741697912],
      [348e-11, 0.64980950594, 1059.3819301892],
      [458e-11, 3.81505682017, 149854.4001348079],
      [302e-11, 1.91723873447, 10447.3878396044],
      [306e-11, 3.55405857884, 8031.0922630584],
      [395e-11, 4.93742673052, 7632.9432596502],
      [314e-11, 3.18058352846, 2352.8661537718],
      [281e-11, 4.41751404023, 9437.762934887],
      [276e-11, 2.71075791682, 3894.1818295422],
      [298e-11, 2.52045757001, 6127.6554505572],
      [272e-11, 0.24370191144, 25132.3033999656],
      [251e-11, 0.55449375765, 6279.5527316424],
      [224e-11, 1.40790249012, 4705.7323075436],
      [258e-11, 5.29510765044, 6812.766815086],
      [178e-11, 0.92636669742, 1990.745017041],
      [217e-11, 0.68543630022, 6256.7775301916],
      [154e-11, 0.77808632062, 14143.4952424306],
      [15e-10, 2.40636982736, 426.598190876],
      [196e-11, 6.06877865012, 640.8776073822],
      [137e-11, 2.21947617717, 8429.2412664666],
      [127e-11, 5.47380312768, 12036.4607348882],
      [121e-11, 3.32740512021, 17789.845619785],
      [123e-11, 2.16004509785, 10213.285546211],
      [116e-11, 0.49705139709, 7058.5984613154],
      [138e-11, 2.36181661472, 11506.7697697936],
      [101e-11, 0.86299995919, 6290.1893969922],
      [118e-11, 5.82317768355, 7860.4193924392],
      [92e-11, 5.11639978593, 7079.3738568078],
      [125e-11, 2.65424538513, 88860.05707098669],
      [88e-11, 4.3118823616, 83996.84731811189],
      [84e-11, 3.57682769713, 16730.4636895958],
      [97e-11, 5.58011309774, 13367.9726311066],
      [102e-11, 2.05853060226, 87.30820453981],
      [8e-10, 4.73827128421, 11926.2544136688],
      [8e-10, 5.41344057121, 10973.55568635],
      [106e-11, 4.10978997399, 3496.032826134],
      [75e-11, 4.89166898876, 5643.1785636774],
      [1e-9, 3.62645659087, 244287.60000722768],
      [96e-11, 1.39443577787, 6681.2248533996],
      [69e-11, 1.88399189965, 10177.2576795336],
      [87e-11, 0.40842153208, 11015.1064773348],
      [66e-11, 0.99444831932, 6525.8044539654],
      [66e-11, 1.42471816453, 9917.6968745098],
      [67e-11, 5.5124099707, 3097.88382272579],
      [76e-11, 2.7156469351, 4164.311989613],
      [85e-11, 0.4965552367, 10575.4066829418],
      [77e-11, 3.51693861509, 11856.2186514245],
      [62e-11, 3.6258762869, 16496.3613962024],
      [54e-11, 5.25957420065, 3340.6124266998],
      [53e-11, 1.10902178415, 8635.9420037632],
      [49e-11, 5.65761054625, 20426.571092422],
      [64e-11, 5.79211164779, 2388.8940204492],
      [46e-11, 5.45092696155, 6275.9623029906],
      [57e-11, 4.97077155798, 14945.3161735544],
      [43e-11, 3.30685683359, 9779.1086761254],
      [42e-11, 1.61412785248, 12168.0026965746],
      [49e-11, 3.92715473768, 5729.506447149],
      [42e-11, 0.6348125893, 2699.7348193176],
      [56e-11, 4.34038639086, 90955.5516944961],
      [4e-10, 5.66871428338, 11712.9553182308],
      [39e-11, 3.10911294009, 16200.7727245012],
      [4e-10, 5.71338386146, 709.9330485583],
      [53e-11, 6.17067257683, 233141.3144043615],
      [37e-11, 0.32095173508, 24356.7807886416],
      [35e-11, 0.95557073457, 17298.1823273262],
      [35e-11, 0.64913397996, 25158.6017197654],
      [41e-11, 1.53850422484, 65147.6197681377],
      [35e-11, 0.77655626359, 13916.0191096416],
      [31e-11, 5.35897350775, 5331.3574437408],
      [3e-10, 4.48114682755, 23543.23050468179],
      [32e-11, 3.45976963453, 7477.522860216],
      [29e-11, 3.46648040769, 13119.72110282519],
      [38e-11, 2.90863974625, 12721.572099417],
      [29e-11, 3.13390968321, 4136.9104335162],
      [35e-11, 3.79717126309, 143571.32428481648],
      [27e-11, 0.95726093828, 12559.038152982],
      [26e-11, 4.9532687703, 5753.3848848968],
      [32e-11, 3.49943896928, 6284.0561710596],
      [26e-11, 4.59276256636, 5884.9268465832],
      [26e-11, 1.53958920253, 154717.6098876827],
      [23e-11, 4.88012908735, 13095.8426650774],
      [23e-11, 0.35935706511, 31415.379249957],
      [24e-11, 5.11515116629, 18319.5365848796],
      [21e-11, 5.73872879912, 12569.6748183318],
      [21e-11, 1.32901200081, 10988.808157535],
      [19e-11, 2.24263229491, 18073.7049386502],
      [19e-11, 3.14253175605, 6496.3749454294],
      [21e-11, 2.80122025076, 6282.0955289232],
      [23e-11, 0.14288760398, 6283.0085396886],
      [19e-11, 4.28209473754, 3930.2096962196],
      [16e-11, 0.25933207663, 11790.6290886588],
      [15e-11, 6.0962350124, 13517.8701062334],
      [2e-10, 5.06358906224, 6283.14316029419],
      [15e-11, 1.0768066315, 4933.2084403326],
      [19e-11, 5.74000581249, 3128.3887650958],
      [16e-11, 6.18924226747, 7342.4577801806],
      [13e-11, 1.69105044945, 4535.0594369244],
      [15e-11, 3.36968394452, 17260.1546546904],
      [1e-10, 3.78885035015, 22003.9146348698],
      [11e-11, 2.12851973876, 7875.6718636242]
    ],
    "3": [
      [289058e-11, 5.84173149732, 6283.0758499914],
      [20712e-11, 6.0498393902, 12566.1516999828],
      [2962e-11, 5.1956057957, 155.4203994342],
      [2527e-11, 3.14159265359, 0],
      [1288e-11, 4.7219761197, 3.523118349],
      [635e-11, 5.96904899168, 242.728603974],
      [57e-10, 5.54182903238, 18849.2275499742],
      [402e-11, 3.78606612895, 553.5694028424],
      [72e-11, 4.37131884946, 6286.5989683404],
      [67e-11, 0.91133898967, 6127.6554505572],
      [37e-11, 5.28611190997, 6438.4962494256],
      [21e-11, 2.94917211527, 6309.3741697912],
      [15e-11, 3.63037493932, 71430.69561812909],
      [11e-11, 4.83261533939, 25132.3033999656],
      [11e-11, 5.84259014283, 6525.8044539654],
      [12e-11, 3.82296977522, 7058.5984613154],
      [13e-11, 2.39991715131, 5729.506447149],
      [8e-11, 0.55390332094, 6040.3472460174],
      [8e-11, 1.46298993048, 11856.2186514245],
      [8e-11, 5.07535888338, 6256.7775301916],
      [6e-11, 2.88803526743, 5507.5532386674],
      [5e-11, 3.87019253131, 12036.4607348882],
      [5e-11, 2.70838853362, 83996.84731811189]
    ],
    "4": [
      [7714e-11, 4.14117321449, 6283.0758499914],
      [1016e-11, 3.27573644241, 12566.1516999828],
      [42e-10, 0.41892851415, 155.4203994342],
      [47e-11, 3.50591071186, 18849.2275499742],
      [41e-11, 3.14032562331, 3.523118349],
      [35e-11, 5.0111077, 5573.1428014331],
      [1e-10, 5.64816633449, 6127.6554505572],
      [13e-11, 0.48609240774, 77713.7714681205],
      [7e-11, 2.84139222289, 161000.6857376741],
      [4e-11, 3.6550904707, 25132.3033999656],
      [2e-11, 0.54880603487, 6438.4962494256]
    ],
    "5": [
      [172e-11, 2.74854172392, 6283.0758499914],
      [5e-10, 2.01352986713, 155.4203994342],
      [28e-11, 2.93369985477, 12566.1516999828],
      [5e-11, 1.93829214518, 18849.2275499742]
    ]
  },
  B: {
    "0": [
      [27962e-10, 3.19870156017, 84334.66158130829],
      [101643e-11, 5.42248619256, 5507.5532386674],
      [80445e-11, 3.88013204458, 5223.6939198022],
      [43806e-11, 3.70444689759, 2352.8661537718],
      [31933e-11, 4.00026369781, 1577.3435424478],
      [22724e-11, 3.9847383156, 1047.7473117547],
      [16392e-11, 3.56456119782, 5856.4776591154],
      [18141e-11, 4.98367470262, 6283.0758499914],
      [14443e-11, 3.70275614915, 9437.762934887],
      [14304e-11, 3.41117857526, 10213.285546211],
      [11246e-11, 4.82820690527, 14143.4952424306],
      [109e-9, 2.08574562329, 6812.766815086],
      [9714e-11, 3.47303947751, 4694.0029547076],
      [10367e-11, 4.05663927945, 71092.88135493269],
      [8775e-11, 4.44016515666, 5753.3848848968],
      [8366e-11, 4.99251512183, 7084.8967811152],
      [6921e-11, 4.32559054073, 6275.9623029906],
      [9145e-11, 1.14182646613, 6620.8901131878],
      [7194e-11, 3.60193205744, 529.6909650946],
      [7698e-11, 5.55425745881, 167621.5758508619],
      [5285e-11, 2.48446991536, 4705.7323075436],
      [5208e-11, 6.24992674532, 18073.7049386502],
      [4529e-11, 2.33827747356, 6309.3741697912],
      [5579e-11, 4.41023653719, 7860.4193924392],
      [4743e-11, 0.70995680136, 5884.9268465832],
      [4301e-11, 1.10255777773, 6681.2248533996],
      [3849e-11, 1.82229412532, 5486.777843175],
      [4093e-11, 5.11700141197, 13367.9726311066],
      [3681e-11, 0.43793170336, 3154.6870848956],
      [342e-10, 5.42034800952, 6069.7767545534],
      [3617e-11, 6.04641937568, 3930.2096962196],
      [367e-10, 4.58210192227, 12194.0329146209],
      [2918e-11, 1.95463881136, 10977.078804699],
      [2797e-11, 5.61259274877, 11790.6290886588],
      [2502e-11, 0.60499729368, 6496.3749454294],
      [2319e-11, 5.01648216088, 1059.3819301892],
      [2684e-11, 1.39470396487, 22003.9146348698],
      [2428e-11, 3.24183056545, 78051.5857313169],
      [212e-10, 4.30691000285, 5643.1785636774],
      [2257e-11, 3.15557225087, 90617.7374312997],
      [1813e-11, 3.75574218286, 3340.6124266998],
      [2226e-11, 2.79699346673, 12036.4607348882],
      [1888e-11, 0.86991545944, 8635.9420037632],
      [1517e-11, 1.9585205571, 398.1490034082],
      [1581e-11, 3.19976230948, 5088.6288397668],
      [1421e-11, 6.25530883828, 2544.3144198834],
      [1595e-11, 0.25619915132, 17298.1823273262],
      [1391e-11, 4.69964175574, 7058.5984613154],
      [1478e-11, 2.81808207569, 25934.1243310894],
      [1481e-11, 3.6582355461, 11506.7697697936],
      [1693e-11, 4.95689385293, 156475.2902479957],
      [1183e-11, 1.29343060777, 775.522611324],
      [1114e-11, 2.37889311847, 3738.761430108],
      [994e-11, 4.30088900425, 9225.539273283],
      [924e-11, 3.06451026809, 4164.311989613],
      [867e-11, 0.55606931068, 8429.2412664666],
      [988e-11, 5.97286104208, 7079.3738568078],
      [824e-11, 1.50984806177, 10447.3878396044],
      [915e-11, 0.12635654605, 11015.1064773348],
      [742e-11, 1.99159139281, 26087.9031415742],
      [1039e-11, 3.14159265359, 0],
      [85e-10, 4.24120016095, 29864.334027309],
      [755e-11, 2.89631873314, 4732.0306273434],
      [714e-11, 1.37548118605, 2146.1654164752],
      [708e-11, 1.91406542362, 8031.0922630584],
      [746e-11, 0.57893808622, 796.2980068164],
      [802e-11, 5.12339137235, 2942.4634232916],
      [751e-11, 1.67479850166, 21228.3920235458],
      [602e-11, 4.099765389, 64809.80550494129],
      [594e-11, 3.49580704849, 16496.3613962024],
      [592e-11, 4.59481504319, 4690.4798363586],
      [53e-10, 5.73979295194, 8827.3902698748],
      [503e-11, 5.66433137112, 33794.5437235286],
      [483e-11, 1.57106522322, 801.8209311238],
      [438e-11, 0.0670773372, 3128.3887650958],
      [423e-11, 2.86944596145, 12566.1516999828],
      [504e-11, 3.2620766916, 7632.9432596502],
      [552e-11, 1.02926440457, 239762.20451754928],
      [427e-11, 3.67434378208, 213.299095438],
      [404e-11, 1.4619329736, 15720.8387848784],
      [503e-11, 4.85802444134, 6290.1893969922],
      [417e-11, 0.81920713533, 5216.5803728014],
      [365e-11, 0.01002966145, 12168.0026965746],
      [363e-11, 1.28376436579, 6206.8097787158],
      [353e-11, 4.7005913311, 7234.794256242],
      [415e-11, 0.96862624176, 4136.9104335162],
      [387e-11, 3.09145061418, 25158.6017197654],
      [373e-11, 2.65119262808, 7342.4577801806],
      [361e-11, 2.97762937735, 9623.6882766912],
      [418e-11, 3.75759994446, 5230.807466803],
      [396e-11, 1.22507712354, 6438.4962494256],
      [322e-11, 1.21162178805, 8662.240323563],
      [284e-11, 5.64170320179, 1589.0728952838],
      [379e-11, 1.72248432756, 14945.3161735544],
      [32e-10, 3.94161159658, 7330.8231617461],
      [313e-11, 5.47602376451, 1194.4470102246],
      [292e-11, 1.38971327568, 11769.8536931664],
      [305e-11, 0.80429352049, 37724.7534197482],
      [257e-11, 5.81382810029, 426.598190876],
      [265e-11, 6.10358507671, 6836.6452528338],
      [25e-10, 4.56452895547, 7477.522860216],
      [266e-11, 2.62926282354, 7238.6755916],
      [263e-11, 6.22089501237, 6133.5126528568],
      [306e-11, 2.79682380532, 1748.016413067],
      [236e-11, 2.46093023707, 11371.7046897582],
      [316e-11, 1.62662805006, 250908.4901204155],
      [216e-11, 3.68721275185, 5849.3641121146],
      [23e-10, 0.36165162947, 5863.5912061162],
      [233e-11, 5.03509933618, 20426.571092422],
      [2e-9, 5.86073159059, 4535.0594369244],
      [277e-11, 4.65400292395, 82239.1669577989],
      [209e-11, 3.72323200803, 10973.55568635],
      [199e-11, 5.05186622555, 5429.8794682394],
      [256e-11, 2.40923279886, 19651.048481098],
      [21e-10, 4.50691909144, 29088.811415985],
      [181e-11, 6.00294783127, 4292.3308329504],
      [249e-11, 0.12900984422, 154379.7956244863],
      [209e-11, 3.87759458541, 17789.845619785],
      [225e-11, 3.18339652605, 18875.525869774],
      [191e-11, 4.53897489216, 18477.1087646123],
      [172e-11, 2.0969418273, 13095.8426650774],
      [182e-11, 3.16107943487, 16730.4636895958],
      [188e-11, 2.22746128596, 41654.9631159678],
      [164e-11, 5.18686274999, 5481.2549188676],
      [16e-10, 2.4929885502, 12592.4500197826],
      [155e-11, 1.59595438224, 10021.8372800994],
      [135e-11, 0.21349051305, 10988.808157535],
      [178e-11, 3.80375178044, 23581.2581773176],
      [123e-11, 1.66800739151, 15110.4661198662],
      [122e-11, 2.72678272224, 18849.2275499742],
      [126e-11, 1.17675512872, 14919.0178537546],
      [142e-11, 3.95053440992, 337.8142631964],
      [116e-11, 6.06340906212, 6709.6740408674],
      [137e-11, 3.52143246244, 12139.5535091068],
      [136e-11, 2.92179113491, 32217.2001810808],
      [11e-10, 3.51203379263, 18052.9295431578],
      [147e-11, 4.63371971408, 22805.7355659936],
      [108e-11, 5.45280815225, 7.1135470008],
      [148e-11, 0.65447253687, 95480.9471841745],
      [119e-11, 5.92110458985, 33019.0211122046],
      [11e-10, 5.34824206403, 639.897286314],
      [106e-11, 3.71081682614, 14314.1681130498],
      [139e-11, 6.17607198262, 24356.7807886416],
      [118e-11, 5.59738712949, 161338.5000008705],
      [117e-11, 3.6506527164, 45585.1728121874],
      [127e-11, 4.74596574209, 49515.382508407],
      [12e-10, 1.04211499785, 6915.8595893046],
      [12e-10, 5.60638811846, 5650.2921106782],
      [115e-11, 3.10668213303, 14712.317116458],
      [99e-11, 0.6901893993, 12779.4507954208],
      [97e-11, 1.07908724794, 9917.6968745098],
      [93e-11, 2.62295197146, 17260.1546546904],
      [99e-11, 4.45774681732, 4933.2084403326],
      [123e-11, 1.37488921994, 28286.9904848612],
      [121e-11, 5.19767249869, 27511.4678735372],
      [105e-11, 0.87192268229, 77375.95720492408],
      [87e-11, 3.9363781295, 17654.7805397496],
      [122e-11, 2.2395606868, 83997.09113559539],
      [87e-11, 4.18201600921, 22779.4372461938],
      [104e-11, 4.59580877285, 1349.8674096588],
      [102e-11, 2.83545248595, 12352.8526045448],
      [102e-11, 3.97386522171, 10818.1352869158],
      [101e-11, 4.32892825818, 36147.4098773004],
      [94e-11, 5.00001709338, 150192.2143980043],
      [77e-11, 3.971993693, 1592.5960136328],
      [1e-9, 6.07733097102, 26735.9452622132],
      [86e-11, 5.2602963825, 28313.288804661],
      [93e-11, 4.31900620254, 44809.6502008634],
      [76e-11, 6.22743405935, 13521.7514415914],
      [72e-11, 1.55820597747, 6256.7775301916],
      [82e-11, 4.95202664555, 10575.4066829418],
      [82e-11, 1.69647647075, 1990.745017041],
      [75e-11, 2.29836095644, 3634.6210245184],
      [75e-11, 2.66367876557, 16200.7727245012],
      [87e-11, 0.26630214764, 31441.6775697568],
      [77e-11, 2.25530952876, 5235.3285382367],
      [76e-11, 1.09869730334, 12903.9659631792],
      [58e-11, 4.28246137794, 12559.038152982],
      [64e-11, 5.51112829602, 173904.65170085328],
      [56e-11, 2.60133794851, 73188.3759784421],
      [55e-11, 5.81483150022, 143233.51002162008],
      [54e-11, 3.38482031504, 323049.11878710287],
      [39e-11, 3.28500401937, 71768.50988132549],
      [39e-11, 3.11239910096, 96900.81328129109]
    ],
    "1": [
      [0.00227777722, 3.4137662053, 6283.0758499914],
      [3805678e-11, 3.37063423795, 12566.1516999828],
      [3619589e-11, 0, 0],
      [71542e-11, 3.32777549735, 18849.2275499742],
      [7655e-11, 1.79489607186, 5223.6939198022],
      [8107e-11, 3.89190403643, 5507.5532386674],
      [6456e-11, 5.1978942475, 2352.8661537718],
      [3894e-11, 2.15568517178, 6279.5527316424],
      [3892e-11, 1.53021064904, 6286.5989683404],
      [3897e-11, 4.87293945629, 10213.285546211],
      [3812e-11, 1.43523182316, 12036.4607348882],
      [3577e-11, 2.32913869227, 83996.84731811189],
      [357e-10, 4.92637739003, 71430.69561812909],
      [3494e-11, 2.20864641831, 529.6909650946],
      [2421e-11, 6.22876183393, 7860.4193924392],
      [2056e-11, 3.06747139741, 14143.4952424306],
      [1399e-11, 0.50107877909, 6309.3741697912],
      [1417e-11, 3.28454570977, 25132.3033999656],
      [1544e-11, 1.82062047625, 5856.4776591154],
      [1457e-11, 1.75339303307, 5884.9268465832],
      [1497e-11, 2.19673914456, 9437.762934887],
      [1549e-11, 5.73650061398, 17789.845619785],
      [1277e-11, 3.9672171733, 4705.7323075436],
      [1038e-11, 2.9481870117, 6256.7775301916],
      [1018e-11, 2.24114547164, 6681.2248533996],
      [1021e-11, 1.4679502613, 11790.6290886588],
      [916e-11, 3.72965830745, 1059.3819301892],
      [1156e-11, 6.04591336669, 398.1490034082],
      [124e-10, 0.77195902957, 6812.766815086],
      [1115e-11, 3.92255876225, 12168.0026965746],
      [908e-11, 1.78447918237, 3930.2096962196],
      [833e-11, 0.09941579828, 11506.7697697936],
      [79e-10, 2.45555993228, 775.522611324],
      [666e-11, 4.40761401665, 5753.3848848968],
      [52e-10, 1.60179602491, 4694.0029547076],
      [382e-11, 0.26754532042, 1577.3435424478],
      [405e-11, 1.97558286872, 6283.0085396886],
      [405e-11, 1.53147989887, 6283.14316029419],
      [388e-11, 2.59563818411, 7058.5984613154],
      [341e-11, 3.61275156842, 13367.9726311066],
      [28e-10, 4.63052251735, 796.2980068164],
      [276e-11, 0.43350778219, 7079.3738568078],
      [311e-11, 5.28219636656, 17260.1546546904],
      [275e-11, 5.27597553634, 11769.8536931664],
      [286e-11, 2.98639716345, 6275.9623029906],
      [251e-11, 2.81315684448, 6290.1893969922],
      [239e-11, 5.77837903893, 10977.078804699],
      [228e-11, 0.14375973844, 3738.761430108],
      [227e-11, 2.51020991853, 7084.8967811152],
      [211e-11, 4.7202946547, 6496.3749454294],
      [234e-11, 3.1153527401, 709.9330485583],
      [234e-11, 0.5707581762, 11856.2186514245],
      [237e-11, 2.38791907394, 213.299095438],
      [227e-11, 1.12059781634, 12352.8526045448],
      [169e-11, 3.20148089605, 5486.777843175],
      [159e-11, 3.14604135756, 8827.3902698748],
      [16e-10, 1.14784478002, 5643.1785636774],
      [144e-11, 5.23285657431, 78051.5857313169],
      [144e-11, 1.16454654602, 90617.7374312997],
      [144e-11, 3.81203756929, 6262.300454499],
      [143e-11, 5.97809021355, 6303.8512454838],
      [138e-11, 4.29829933273, 1589.0728952838],
      [161e-11, 3.03298851492, 20426.571092422],
      [165e-11, 5.09134896587, 17298.1823273262],
      [128e-11, 4.41590143012, 6127.6554505572],
      [158e-11, 2.00984506334, 5230.807466803],
      [13e-10, 1.44170683802, 12569.6748183318],
      [125e-11, 1.69950379498, 3128.3887650958],
      [152e-11, 4.96946111415, 65147.6197681377],
      [131e-11, 4.24961399629, 6282.0955289232],
      [131e-11, 5.54051222995, 6284.0561710596],
      [161e-11, 3.32421999691, 6283.3196674749],
      [123e-11, 2.93221463795, 15720.8387848784],
      [152e-11, 1.56488157456, 18319.5365848796],
      [114e-11, 1.89110005546, 18073.7049386502],
      [113e-11, 4.95214866677, 4136.9104335162],
      [111e-11, 4.79699611405, 8429.2412664666],
      [118e-11, 3.06184958762, 22003.9146348698],
      [128e-11, 2.09693027395, 12562.6285816338],
      [138e-11, 0.84648544836, 6069.7767545534],
      [1e-9, 0.41938790104, 5481.2549188676],
      [101e-11, 4.43791289246, 19651.048481098],
      [116e-11, 1.87002428935, 77713.7714681205],
      [95e-11, 0.68638183645, 3340.6124266998],
      [104e-11, 4.90822646457, 8635.9420037632],
      [114e-11, 0.36008214928, 23543.23050468179],
      [91e-11, 1.1761121931, 9225.539273283],
      [91e-11, 2.74682631104, 5216.5803728014],
      [86e-11, 3.09315282195, 1194.4470102246],
      [93e-11, 6.2764351319, 12559.038152982],
      [87e-11, 3.64926989547, 7.1135470008],
      [83e-11, 0.37008971174, 11371.7046897582],
      [98e-11, 4.68473306376, 167283.7615876655],
      [98e-11, 0.99865886857, 154717.6098876827],
      [86e-11, 4.41152307486, 25934.1243310894],
      [98e-11, 4.98209568932, 16496.3613962024],
      [85e-11, 2.35438163823, 3154.6870848956],
      [83e-11, 0.24859477658, 21228.3920235458],
      [76e-11, 5.46661600296, 29864.334027309],
      [69e-11, 3.22045334237, 801.8209311238],
      [68e-11, 2.19928242745, 37724.7534197482],
      [7e-10, 5.33711014698, 2544.3144198834],
      [55e-11, 5.37872238211, 11015.1064773348],
      [51e-11, 5.03600618727, 5863.5912061162],
      [59e-11, 3.54984809612, 4535.0594369244],
      [53e-11, 1.50812064137, 7342.4577801806],
      [44e-11, 1.33712241647, 4164.311989613],
      [55e-11, 5.38460045253, 7477.522860216],
      [49e-11, 5.61844340512, 24072.9214697764],
      [57e-11, 6.17973522898, 8031.0922630584],
      [52e-11, 4.24379064407, 5088.6288397668],
      [41e-11, 3.41960196246, 26087.9031415742],
      [52e-11, 1.68150981131, 25158.6017197654],
      [53e-11, 0.11041408311, 29088.811415985],
      [43e-11, 0.53354396923, 2146.1654164752],
      [5e-10, 0.60270799844, 33794.5437235286],
      [45e-11, 1.69577010458, 6702.5604938666],
      [37e-11, 6.09033460795, 64809.80550494129],
      [44e-11, 2.67993061247, 15110.4661198662],
      [47e-11, 3.62555676035, 41654.9631159678],
      [36e-11, 0.47219666269, 13095.8426650774],
      [35e-11, 5.99520523215, 23581.2581773176],
      [43e-11, 4.08726331262, 156137.47598479927],
      [43e-11, 5.17376496602, 18422.62935909819],
      [34e-11, 2.14460100274, 4933.2084403326],
      [3e-10, 4.12992793541, 426.598190876],
      [36e-11, 2.28596930002, 90279.92316810328],
      [32e-11, 0.81117747619, 26.2983197998],
      [28e-11, 4.07036560467, 14712.317116458],
      [25e-11, 1.92905243842, 1748.016413067],
      [24e-11, 5.06152880842, 16730.4636895958],
      [23e-11, 3.24047012195, 31415.379249957],
      [27e-11, 3.90672018305, 18451.07854656599],
      [21e-11, 3.51419811826, 10447.3878396044]
    ],
    "2": [
      [9721424e-11, 5.1519280992, 6283.0758499914],
      [233002e-11, 3.14159265359, 0],
      [134188e-11, 0.64406212977, 12566.1516999828],
      [6504e-11, 1.07333397797, 18849.2275499742],
      [1662e-11, 1.62746869551, 84334.66158130829],
      [635e-11, 3.51985338656, 6279.5527316424],
      [492e-11, 2.41382223971, 1047.7473117547],
      [307e-11, 6.10181422085, 5223.6939198022],
      [322e-11, 0.37660897389, 6286.5989683404],
      [326e-11, 2.35727931602, 5507.5532386674],
      [274e-11, 1.65307581765, 7860.4193924392],
      [228e-11, 1.14082932988, 25132.3033999656],
      [202e-11, 0.4983668253, 2352.8661537718],
      [201e-11, 0.155527656, 10213.285546211],
      [167e-11, 3.98005254015, 529.6909650946],
      [17e-10, 5.28668290523, 6256.7775301916],
      [166e-11, 3.04613930284, 12036.4607348882],
      [153e-11, 4.06779216239, 83996.84731811189],
      [15e-10, 3.18772213951, 71430.69561812909],
      [12e-10, 3.13558669517, 5884.9268465832],
      [123e-11, 4.17102530625, 6309.3741697912],
      [1e-9, 1.46356761368, 11506.7697697936],
      [1e-9, 3.00322421365, 11790.6290886588],
      [77e-11, 1.65643898948, 4705.7323075436],
      [68e-11, 6.03791904123, 6812.766815086],
      [75e-11, 4.85191600582, 14143.4952424306],
      [79e-11, 4.12628805658, 5753.3848848968],
      [64e-11, 2.7194416046, 6127.6554505572],
      [63e-11, 0.78655326011, 6438.4962494256],
      [75e-11, 0.84213523741, 167621.5758508619],
      [51e-11, 4.55059044701, 5486.777843175],
      [5e-10, 5.29314320585, 7079.3738568078],
      [45e-11, 0.33147576416, 775.522611324],
      [43e-11, 3.6179371164, 1577.3435424478],
      [57e-11, 6.15295833679, 12194.0329146209],
      [45e-11, 1.18274698508, 17789.845619785],
      [47e-11, 1.11643162773, 398.1490034082],
      [47e-11, 5.5298423843, 12168.0026965746],
      [42e-11, 2.6437530062, 10988.808157535],
      [37e-11, 0.31226891972, 6681.2248533996],
      [46e-11, 3.38617099014, 156475.2902479957],
      [33e-11, 1.26266496002, 6290.1893969922],
      [33e-11, 2.25067065498, 6275.9623029906],
      [27e-11, 1.72859626293, 1059.3819301892],
      [28e-11, 2.88681054153, 796.2980068164],
      [3e-10, 5.52021264181, 7058.5984613154],
      [21e-11, 6.22275008403, 6069.7767545534],
      [24e-11, 5.83690442827, 6282.0955289232],
      [24e-11, 3.95322179797, 6284.0561710596],
      [21e-11, 4.87022458966, 3738.761430108],
      [21e-11, 3.58048145762, 6496.3749454294],
      [22e-11, 1.97770318395, 7.1135470008],
      [19e-11, 3.4597988877, 4136.9104335162],
      [15e-11, 2.81379880771, 1589.0728952838],
      [15e-11, 1.61313151838, 1194.4470102246],
      [15e-11, 0.63083434831, 11769.8536931664],
      [19e-11, 0.28082047767, 17260.1546546904],
      [17e-11, 1.35165136146, 78051.5857313169],
      [15e-11, 2.3094159956, 11856.2186514245],
      [12e-11, 1.12997370513, 90617.7374312997],
      [12e-11, 0.00611601597, 18073.7049386502],
      [12e-11, 1.70058636365, 12559.038152982]
    ],
    "3": [
      [275993e-11, 0.59480097092, 6283.0758499914],
      [17034e-11, 3.14159265359, 0],
      [3617e-11, 0.11750575325, 12566.1516999828],
      [339e-11, 5.66087461682, 18849.2275499742],
      [56e-11, 5.02765554835, 6279.5527316424],
      [19e-11, 5.99007646261, 6256.7775301916],
      [18e-11, 3.80004734567, 6309.3741697912],
      [18e-11, 1.21049250774, 6127.6554505572],
      [18e-11, 2.29734567137, 6438.4962494256],
      [15e-11, 4.72881467263, 6286.5989683404],
      [12e-11, 0.41481671808, 83996.84731811189],
      [13e-11, 5.54637369296, 25132.3033999656],
      [1e-10, 2.91937214232, 71430.69561812909],
      [6e-11, 2.1417324121, 11856.2186514245]
    ],
    "4": [
      [5745e-11, 2.26734029843, 6283.0758499914],
      [87e-10, 0, 0],
      [119e-11, 4.26807972611, 12566.1516999828],
      [17e-11, 4.0742262044, 18849.2275499742],
      [5e-11, 0.84308705203, 1047.7473117547],
      [5e-11, 0.05711572303, 84334.66158130829]
    ],
    "5": [
      [114e-11, 4.31455980099, 6283.0758499914],
      [24e-11, 0, 0]
    ]
  },
  R: {
    "0": [
      [1.00013988784, 0, 0],
      [0.01670699632, 3.09846350258, 6283.0758499914],
      [13956024e-11, 3.05524609456, 12566.1516999828],
      [308372e-10, 5.19846674381, 77713.7714681205],
      [1628463e-11, 1.17387558054, 5753.3848848968],
      [1575572e-11, 2.84685214877, 7860.4193924392],
      [924799e-11, 5.45292236722, 11506.7697697936],
      [542439e-11, 4.56409151453, 3930.2096962196],
      [47211e-10, 3.66100022149, 5884.9268465832],
      [32878e-10, 5.89983686142, 5223.6939198022],
      [345969e-11, 0.96368627272, 5507.5532386674],
      [306784e-11, 0.29867139512, 5573.1428014331],
      [174844e-11, 3.01193636733, 18849.2275499742],
      [243181e-11, 4.2734953079, 11790.6290886588],
      [211836e-11, 5.84714461348, 1577.3435424478],
      [18574e-10, 5.02199710705, 10977.078804699],
      [109835e-11, 5.0551063586, 5486.777843175],
      [98316e-11, 0.88681311278, 6069.7767545534],
      [865e-9, 5.68956418946, 15720.8387848784],
      [85831e-11, 1.27079125277, 161000.6857376741],
      [62917e-11, 0.92177053978, 529.6909650946],
      [57056e-11, 2.01374292245, 83996.84731811189],
      [64908e-11, 0.27251341435, 17260.1546546904],
      [49384e-11, 3.24501240359, 2544.3144198834],
      [55736e-11, 5.2415979917, 71430.69561812909],
      [4252e-10, 6.01110257982, 6275.9623029906],
      [46966e-11, 2.57799853213, 775.522611324],
      [38963e-11, 5.36063832897, 4694.0029547076],
      [44666e-11, 5.53715663816, 9437.762934887],
      [35661e-11, 1.67447135798, 12036.4607348882],
      [31922e-11, 0.18368299942, 5088.6288397668],
      [31846e-11, 1.77775642078, 398.1490034082],
      [33193e-11, 0.24370221704, 7084.8967811152],
      [38245e-11, 2.39255343973, 8827.3902698748],
      [28468e-11, 1.21344887533, 6286.5989683404],
      [37486e-11, 0.82961281844, 19651.048481098],
      [36957e-11, 4.90107587287, 12139.5535091068],
      [34537e-11, 1.84270693281, 2942.4634232916],
      [26275e-11, 4.58896863104, 10447.3878396044],
      [24596e-11, 3.78660838036, 8429.2412664666],
      [23587e-11, 0.26866098169, 796.2980068164],
      [27795e-11, 1.89934427832, 6279.5527316424],
      [23927e-11, 4.99598548145, 5856.4776591154],
      [20345e-11, 4.65282190725, 2146.1654164752],
      [23287e-11, 2.80783632869, 14143.4952424306],
      [22099e-11, 1.95002636847, 3154.6870848956],
      [19509e-11, 5.38233922479, 2352.8661537718],
      [17958e-11, 0.1987136996, 6812.766815086],
      [17178e-11, 4.43322156854, 10213.285546211],
      [1619e-10, 5.23159323213, 17789.845619785],
      [17315e-11, 6.15224075188, 16730.4636895958],
      [13814e-11, 5.18962074032, 8031.0922630584],
      [18834e-11, 0.67280058021, 149854.4001348079],
      [1833e-10, 2.25348717053, 23581.2581773176],
      [13639e-11, 3.68511810757, 4705.7323075436],
      [13142e-11, 0.65267698994, 13367.9726311066],
      [10414e-11, 4.33285688501, 11769.8536931664],
      [9978e-11, 4.20126336356, 6309.3741697912],
      [1017e-10, 1.59366684542, 4690.4798363586],
      [7564e-11, 2.62560597391, 6256.7775301916],
      [9654e-11, 3.67583728703, 27511.4678735372],
      [6743e-11, 0.56269927047, 3340.6124266998],
      [8743e-11, 6.06359123461, 1748.016413067],
      [7786e-11, 3.67371235367, 12168.0026965746],
      [6633e-11, 5.66149277789, 11371.7046897582],
      [7712e-11, 0.31242577788, 7632.9432596502],
      [6586e-11, 3.13580054586, 801.8209311238],
      [746e-10, 5.6475806666, 11926.2544136688],
      [6933e-11, 2.92384586372, 6681.2248533996],
      [6805e-11, 1.42327153767, 23013.5395395872],
      [6118e-11, 5.13395999022, 1194.4470102246],
      [6477e-11, 2.64986648493, 19804.8272915828],
      [5233e-11, 4.62432817299, 6438.4962494256],
      [6147e-11, 3.02863936662, 233141.3144043615],
      [4608e-11, 1.72194702724, 7234.794256242],
      [4221e-11, 1.55697533726, 7238.6755916],
      [531e-10, 2.40821524293, 11499.6562227928],
      [5128e-11, 5.3239896569, 11513.8833167944],
      [477e-10, 0.2555431173, 11856.2186514245],
      [5519e-11, 2.09089153789, 17298.1823273262],
      [5625e-11, 4.34052903053, 90955.5516944961],
      [4578e-11, 4.4656964157, 5746.271337896],
      [3788e-11, 4.9072829481, 4164.311989613],
      [5337e-11, 5.09957905103, 31441.6775697568],
      [3967e-11, 1.20054555175, 1349.8674096588],
      [4005e-11, 3.02853885902, 1059.3819301892],
      [348e-10, 0.76066308841, 10973.55568635],
      [4232e-11, 1.05485713117, 5760.4984318976],
      [4582e-11, 3.76570026763, 6386.16862421],
      [3335e-11, 3.13829943354, 6836.6452528338],
      [342e-10, 3.00043974511, 4292.3308329504],
      [3595e-11, 5.70703236079, 5643.1785636774],
      [3236e-11, 4.16387400645, 9917.6968745098],
      [4154e-11, 2.59940749519, 7058.5984613154],
      [3362e-11, 4.54577164994, 4732.0306273434],
      [2978e-11, 1.3056126882, 6283.14316029419],
      [2765e-11, 0.51311975671, 26.2983197998],
      [2807e-11, 5.66230537649, 8635.9420037632],
      [2927e-11, 5.7378783408, 16200.7727245012],
      [3167e-11, 1.691817599, 11015.1064773348],
      [2598e-11, 2.96244118358, 25132.3033999656],
      [3519e-11, 3.62639325753, 244287.60000722768],
      [2676e-11, 4.20727719487, 18073.7049386502],
      [2978e-11, 1.74971565805, 6283.0085396886],
      [2287e-11, 1.06976449088, 14314.1681130498],
      [2863e-11, 5.92838917309, 14712.317116458],
      [3071e-11, 0.23793217, 35371.8872659764],
      [2656e-11, 0.89959301615, 12352.8526045448],
      [2415e-11, 2.799751768, 709.9330485583],
      [2811e-11, 3.51513864541, 21228.3920235458],
      [1977e-11, 2.61358297551, 951.7184062506],
      [2548e-11, 2.47684686575, 6208.2942514241],
      [1999e-11, 0.56090396506, 7079.3738568078],
      [2305e-11, 1.05376463592, 22483.84857449259],
      [1855e-11, 2.86093570752, 5216.5803728014],
      [2157e-11, 1.31395211105, 154717.6098876827],
      [197e-10, 4.36931551625, 167283.7615876655],
      [1754e-11, 2.14452400686, 6290.1893969922],
      [1628e-11, 5.85704450617, 10984.1923516998],
      [2154e-11, 6.03828353794, 10873.9860304804],
      [1714e-11, 3.70158195222, 1592.5960136328],
      [1541e-11, 6.21599512982, 23543.23050468179],
      [1602e-11, 1.99860679677, 10969.9652576982],
      [1712e-11, 1.34295218697, 3128.3887650958],
      [1647e-11, 5.54948299069, 6496.3749454294],
      [1495e-11, 5.43980459648, 155.4203994342],
      [1827e-11, 5.91227480351, 3738.761430108],
      [1726e-11, 2.16765465036, 10575.4066829418],
      [1532e-11, 5.35683107063, 13521.7514415914],
      [1824e-11, 1.66056145084, 39302.096962196],
      [1605e-11, 1.90930973224, 6133.5126528568],
      [1282e-11, 2.46013372544, 13916.0191096416],
      [1211e-11, 4.4136063155, 3894.1818295422],
      [1394e-11, 1.7780192925, 9225.539273283],
      [1571e-11, 4.95512957606, 25158.6017197654],
      [1205e-11, 1.19212756308, 3.523118349],
      [1132e-11, 2.69830084955, 6040.3472460174],
      [1504e-11, 5.77577388271, 18209.33026366019],
      [1393e-11, 1.62625077326, 5120.6011455836],
      [1081e-11, 2.93726744446, 17256.6315363414],
      [1232e-11, 0.71651766504, 143571.32428481648],
      [1087e-11, 0.99769687961, 955.5997416086],
      [1068e-11, 5.28472576591, 65147.6197681377],
      [1169e-11, 3.11663802316, 14945.3161735544],
      [975e-11, 5.1088726078, 6172.869528772],
      [1202e-11, 4.02992510403, 553.5694028424],
      [979e-11, 2.00000879106, 15110.4661198662],
      [962e-11, 4.023807714, 6282.0955289232],
      [999e-11, 3.6264300279, 6262.300454499],
      [103e-10, 5.84987815239, 213.299095438],
      [1014e-11, 2.84227679965, 8662.240323563],
      [1185e-11, 1.51330629149, 17654.7805397496],
      [967e-11, 2.67081017562, 5650.2921106782],
      [1222e-11, 2.65423784904, 88860.05707098669],
      [986e-11, 2.36212814824, 6206.8097787158],
      [1034e-11, 0.13634950642, 11712.9553182308],
      [1103e-11, 3.08477302937, 43232.3066584156],
      [781e-11, 2.53374971725, 16496.3613962024],
      [1019e-11, 3.04569392376, 6037.244203762],
      [795e-11, 5.80662989126, 5230.807466803],
      [813e-11, 3.57702871938, 10177.2576795336],
      [962e-11, 5.31470594766, 6284.0561710596],
      [717e-11, 5.95797471837, 12559.038152982],
      [967e-11, 2.74413738053, 6244.9428143536],
      [921e-11, 0.1016016083, 29088.811415985],
      [719e-11, 5.91788189939, 4136.9104335162],
      [688e-11, 3.89489045092, 1589.0728952838],
      [772e-11, 4.05505380285, 6127.6554505572],
      [706e-11, 5.49323197725, 22003.9146348698],
      [665e-11, 1.60002747134, 11087.2851259184],
      [69e-10, 4.50539825729, 426.598190876],
      [854e-11, 3.2610464506, 20426.571092422],
      [656e-11, 4.3241018294, 16858.4825329332],
      [84e-10, 2.59572585212, 28766.924424484],
      [686e-11, 0.61944033771, 11403.676995575],
      [7e-9, 3.40901412473, 7.1135470008],
      [728e-11, 0.04050185963, 5481.2549188676],
      [653e-11, 1.0386945123, 6062.6632075526],
      [559e-11, 4.79221805695, 20199.094959633],
      [633e-11, 5.70229959167, 45892.73043315699],
      [591e-11, 6.10986487621, 9623.6882766912],
      [52e-10, 3.62310356479, 5333.9002410216],
      [602e-11, 5.58381898589, 10344.2950653858],
      [496e-11, 2.21027756314, 1990.745017041],
      [691e-11, 1.96733114988, 12416.5885028482],
      [64e-10, 1.59062417043, 18319.5365848796],
      [625e-11, 3.82358168221, 13517.8701062334],
      [475e-11, 1.1702590418, 12569.6748183318],
      [66e-10, 5.08498512995, 283.8593188652],
      [664e-11, 4.50029469969, 47162.5163546352],
      [569e-11, 0.16318535463, 17267.26820169119],
      [568e-11, 3.86100969474, 6076.8903015542],
      [462e-11, 0.26368763517, 4590.910180489],
      [535e-11, 4.83225423196, 18422.62935909819],
      [466e-11, 0.75873879417, 7342.4577801806],
      [541e-11, 3.07212190556, 226858.23855437007],
      [61e-10, 1.53597089605, 33019.0211122046],
      [617e-11, 2.62356328726, 11190.377900137],
      [548e-11, 4.55798855803, 18875.525869774],
      [633e-11, 4.60110281228, 66567.48586525429],
      [587e-11, 5.78087907808, 632.7837393132],
      [603e-11, 5.38458554802, 316428.22867391503],
      [525e-11, 5.01522072363, 12132.439962106],
      [469e-11, 0.59975173763, 21954.15760939799],
      [548e-11, 3.50627043672, 17253.04110768959],
      [502e-11, 0.98804327589, 11609.8625440122],
      [568e-11, 1.98497313089, 7668.6374249425],
      [482e-11, 1.62460405687, 12146.6670561076],
      [391e-11, 3.68718382972, 18052.9295431578],
      [457e-11, 3.7721489661, 156137.47598479927],
      [401e-11, 5.2922154024, 15671.0817594066],
      [469e-11, 1.80963351735, 12562.6285816338],
      [514e-11, 3.37031288919, 20597.2439630412],
      [452e-11, 5.66811219778, 10454.5013866052],
      [375e-11, 4.98528185039, 9779.1086761254],
      [523e-11, 0.97215560834, 155427.542936241],
      [403e-11, 5.1394818977, 1551.045222648],
      [372e-11, 3.69883738807, 9388.0059094152],
      [367e-11, 4.43875659833, 4535.0594369244],
      [406e-11, 4.20863156497, 12592.4500197826],
      [362e-11, 2.55099560446, 242.728603974],
      [471e-11, 4.61907324819, 5436.9930152402],
      [388e-11, 4.960209284, 24356.7807886416],
      [441e-11, 5.83872966262, 3496.032826134],
      [349e-11, 6.16307810648, 19800.9459562248],
      [356e-11, 0.2381908124, 5429.8794682394],
      [346e-11, 5.60809622572, 2379.1644735716],
      [38e-10, 2.72105213132, 11933.3679606696],
      [432e-11, 0.24215988572, 17996.0311682222],
      [378e-11, 5.22516848076, 7477.522860216],
      [337e-11, 5.10885555836, 5849.3641121146],
      [315e-11, 0.57827745123, 10557.5941608238],
      [318e-11, 4.4994900732, 3634.6210245184],
      [323e-11, 1.55850824803, 10440.2742926036],
      [314e-11, 5.77154773334, 20.7753954924],
      [303e-11, 2.34615580398, 4686.8894077068],
      [414e-11, 5.9323760231, 51092.7260508548],
      [362e-11, 2.17561997119, 28237.2334593894],
      [288e-11, 0.18377405421, 13095.8426650774],
      [277e-11, 5.1295220503, 13119.72110282519],
      [325e-11, 6.18608287927, 6268.8487559898],
      [273e-11, 0.30522428863, 23141.5583829246],
      [267e-11, 5.76152585786, 5966.6839803348],
      [345e-11, 2.94246040875, 36949.2308084242],
      [253e-11, 5.20994580359, 24072.9214697764],
      [342e-11, 5.76212804329, 16460.33352952499],
      [307e-11, 6.01039067183, 22805.7355659936],
      [261e-11, 2.00304796059, 6148.010769956],
      [238e-11, 5.08241964961, 6915.8595893046],
      [249e-11, 2.94762789744, 135.0650800354],
      [306e-11, 3.89765478921, 10988.808157535],
      [308e-11, 0.05451027736, 4701.1165017084],
      [319e-11, 2.95712862064, 163096.18036118348],
      [272e-11, 2.07967681309, 4804.209275927],
      [209e-11, 4.43768461442, 6546.1597733642],
      [217e-11, 0.73691592312, 6303.8512454838],
      [203e-11, 0.32033085531, 25934.1243310894],
      [205e-11, 5.22936478995, 20995.3929664494],
      [213e-11, 0.20671418919, 28286.9904848612],
      [197e-11, 0.4828613129, 16737.5772365966],
      [23e-10, 6.06567392849, 6287.0080032545],
      [219e-11, 1.291942163, 5326.7866940208],
      [201e-11, 1.74700937253, 22743.4093795164],
      [207e-11, 4.45440927276, 6279.4854213396],
      [269e-11, 6.0564044503, 64471.99124174489],
      [19e-10, 0.99261116842, 29296.6153895786],
      [194e-11, 3.82656562755, 419.4846438752],
      [262e-11, 5.26961924126, 522.5774180938],
      [21e-10, 4.68618183158, 6254.6266625236],
      [197e-11, 2.80624554186, 4933.2084403326],
      [252e-11, 4.3622015462, 40879.4405046438],
      [261e-11, 1.07241516738, 55022.9357470744],
      [233e-11, 5.41751014958, 39609.6545831656],
      [185e-11, 4.14324541379, 5642.1982426092],
      [247e-11, 3.44855612987, 6702.5604938666],
      [205e-11, 4.04424043226, 536.8045120954],
      [191e-11, 3.15807087926, 16723.350142595],
      [222e-11, 5.16259496507, 23539.7073863328],
      [18e-10, 4.56214752149, 6489.2613984286],
      [227e-11, 0.60156339452, 5905.7022420756],
      [17e-10, 0.93185903228, 16062.1845261168],
      [159e-11, 0.92751013112, 23937.856389741],
      [157e-11, 4.69607868164, 6805.6532680852],
      [218e-11, 0.8553337343, 16627.3709153772],
      [169e-11, 0.94641052064, 3097.88382272579],
      [207e-11, 4.88410451334, 6286.6662786432],
      [16e-10, 4.95943826819, 10021.8372800994],
      [175e-11, 6.12762824563, 239424.39025435288],
      [173e-11, 3.13887234973, 6179.9830757728],
      [157e-11, 3.62822057807, 18451.07854656599],
      [206e-11, 5.74617821138, 3646.3503773544],
      [157e-11, 4.67695912207, 6709.6740408674],
      [146e-11, 3.09506069745, 4907.3020501456],
      [165e-11, 2.2713912876, 10660.6869350424],
      [144e-11, 3.96947747592, 6019.9919266186],
      [171e-11, 5.91302216729, 6058.7310542895],
      [144e-11, 2.1315565512, 26084.0218062162],
      [151e-11, 0.67417383565, 2388.8940204492],
      [196e-11, 1.67718461229, 2107.0345075424],
      [146e-11, 5.10373877968, 10770.8932562618],
      [187e-11, 1.23915444627, 19402.7969528166],
      [137e-11, 1.26247412216, 12566.2190102856],
      [191e-11, 5.03547476279, 263.0839233728],
      [137e-11, 3.52825454595, 639.897286314],
      [135e-11, 0.73840670927, 5017.508371365],
      [164e-11, 2.39195095081, 6357.8574485587],
      [168e-11, 0.05515907462, 9380.9596727172],
      [161e-11, 1.15721259392, 26735.9452622132],
      [144e-11, 1.76097645199, 5888.4499649322],
      [131e-11, 2.51859277344, 6599.467719648],
      [142e-11, 2.43802911123, 5881.4037282342],
      [159e-11, 5.90325893762, 6281.5913772831],
      [151e-11, 3.72338532519, 12669.2444742014],
      [132e-11, 2.38417741883, 6525.8044539654],
      [127e-11, 0.00254936441, 10027.9031957292],
      [148e-11, 2.85102145528, 6418.1409300268],
      [143e-11, 5.7446027956, 26087.9031415742],
      [172e-11, 0.4128996224, 174242.4659640497],
      [136e-11, 4.15497742275, 6311.5250374592],
      [17e-10, 5.98194913129, 327574.51427678124],
      [136e-11, 2.48430537541, 13341.6743113068],
      [149e-11, 0.33002271275, 245.8316462294],
      [165e-11, 2.496679246, 58953.145443294],
      [123e-11, 1.67328384813, 32217.2001810808],
      [123e-11, 3.45660563754, 6277.552925684],
      [117e-11, 0.86065134175, 6245.0481773556],
      [149e-11, 5.61358281003, 5729.506447149],
      [128e-11, 0.71204006448, 103.0927742186],
      [159e-11, 2.43166592149, 221995.02880149524],
      [137e-11, 1.706577092, 12566.08438968],
      [129e-11, 2.80667872683, 6016.4688082696],
      [113e-11, 3.58302904101, 25685.872802808],
      [109e-11, 3.26403795962, 6819.8803620868],
      [122e-11, 0.34120688202, 1162.4747044078],
      [106e-11, 1.59721172719, 17782.7320727842],
      [144e-11, 2.28891651774, 12489.8856287072],
      [137e-11, 5.82029768354, 44809.6502008634],
      [134e-11, 1.26539983018, 5331.3574437408],
      [103e-11, 5.96518130595, 6321.1035226272],
      [109e-11, 0.33808549034, 11300.5842213564],
      [129e-11, 5.8918727719, 12029.3471878874],
      [122e-11, 5.77325634636, 11919.140866668],
      [107e-11, 6.2499898935, 77690.75950573849],
      [107e-11, 1.00535580713, 77736.78343050249],
      [115e-11, 5.86963518266, 12721.572099417],
      [102e-11, 5.66283467269, 5540.0857894588],
      [143e-11, 0.24122178432, 4214.0690150848],
      [143e-11, 0.88529649733, 7576.560073574],
      [107e-11, 2.92124030351, 31415.379249957],
      [1e-9, 5.99485644501, 4061.2192153944],
      [103e-11, 2.41941934525, 5547.1993364596],
      [104e-11, 4.44106051277, 2118.7638603784],
      [11e-10, 0.37559635174, 5863.5912061162],
      [124e-11, 2.55619029611, 12539.853380183],
      [11e-10, 3.66952094465, 238004.5241572363],
      [112e-11, 4.32512422724, 97238.62754448749],
      [12e-10, 1.26895630075, 12043.574281889],
      [97e-11, 5.42612959752, 7834.1210726394],
      [94e-11, 2.56461130309, 19004.6479494084],
      [105e-11, 5.68272475301, 16522.6597160022],
      [117e-11, 3.65425622684, 34520.3093093808],
      [108e-11, 1.24206843948, 84672.47584450469],
      [98e-11, 0.13589994287, 11080.1715789176],
      [97e-11, 2.46722096722, 71980.63357473118],
      [95e-11, 5.36958330451, 6288.5987742988],
      [96e-11, 0.20796618776, 18139.2945014159],
      [111e-11, 5.01961920313, 11823.1616394502],
      [9e-10, 2.72355843779, 26880.3198130326],
      [99e-11, 0.90164266199, 18635.9284545362],
      [126e-11, 4.78722177847, 305281.9430710488],
      [124e-11, 5.00979495566, 172146.9713405403],
      [9e-10, 4.50544881196, 40077.61957352],
      [104e-11, 5.6367968071, 2787.0430238574],
      [91e-11, 5.43564326147, 6272.0301497275],
      [1e-9, 2.00639461597, 12323.4230960088],
      [117e-11, 2.35555589778, 83286.91426955358],
      [105e-11, 2.59824000109, 30666.1549584328],
      [9e-10, 2.35779490026, 12491.3701014155],
      [89e-11, 3.57152453732, 11720.0688652316],
      [95e-11, 5.67015349858, 14919.0178537546],
      [87e-11, 1.86043406047, 27707.5424942948],
      [106e-11, 3.04150600352, 22345.2603761082],
      [82e-11, 5.58298993353, 10241.2022911672],
      [83e-11, 3.10607039533, 36147.4098773004],
      [94e-11, 5.47749711149, 9924.8104215106],
      [82e-11, 4.71988314145, 15141.390794312],
      [96e-11, 3.89073946348, 6379.0550772092],
      [11e-10, 4.92131611151, 5621.8429232104],
      [11e-10, 4.89978492291, 72140.6286666874],
      [97e-11, 5.20764563059, 6303.4311693902],
      [85e-11, 1.61269222311, 33326.5787331742],
      [93e-11, 1.32651591333, 23020.65308658799],
      [9e-10, 0.5773301638, 26482.1708096244],
      [78e-11, 3.99588630754, 11293.4706743556],
      [106e-11, 3.92012705073, 62883.3551395136],
      [98e-11, 2.94397773524, 316.3918696566],
      [76e-11, 3.96310417608, 29026.48522950779],
      [98e-11, 0.95914722366, 48739.859897083],
      [78e-11, 1.97068528043, 90279.92316810328],
      [76e-11, 0.23027966596, 21424.4666443034],
      [79e-11, 1.46227790922, 8982.810669309],
      [78e-11, 2.28840998832, 266.6070417218],
      [71e-11, 1.5194076559, 33794.5437235286],
      [76e-11, 0.22880641443, 57375.8019008462],
      [97e-11, 0.39449562097, 24279.10701821359],
      [75e-11, 2.77638584795, 12964.300703391],
      [77e-11, 5.18846946344, 11520.9968637952],
      [68e-11, 0.50006599129, 4274.5183108324],
      [75e-11, 2.07323762803, 15664.03552270859],
      [77e-11, 0.4666517878, 16207.886271502],
      [81e-11, 4.10452219483, 161710.6187862324],
      [71e-11, 3.91415328513, 7875.6718636242],
      [81e-11, 0.91938383406, 74.7815985673],
      [83e-11, 4.69916218791, 23006.42599258639],
      [69e-11, 0.98999300277, 6393.2821712108],
      [65e-11, 5.41938745446, 28628.3362260996],
      [73e-11, 2.45564765251, 15508.6151232744],
      [65e-11, 3.02336771694, 5959.570433334],
      [64e-11, 0.18375587635, 1066.49547719],
      [8e-10, 5.81239171612, 12341.8069042809],
      [66e-11, 2.15105504851, 38.0276726358],
      [67e-11, 5.14047250153, 9814.6041002912],
      [62e-11, 2.43313614978, 10138.1095169486],
      [68e-11, 2.24442548639, 24383.0791084414],
      [78e-11, 1.39649333997, 9411.4646150872],
      [59e-11, 4.95362151577, 35707.7100829074],
      [73e-11, 1.35229143121, 5327.4761083828],
      [57e-11, 3.16018882154, 5490.300961524],
      [72e-11, 5.91833527334, 10881.0995774812],
      [67e-11, 0.66414713064, 29864.334027309],
      [65e-11, 0.30352816135, 7018.9523635232],
      [59e-11, 5.36231868425, 10239.5838660108],
      [56e-11, 3.22196331515, 2636.725472637],
      [68e-11, 5.32086226658, 3116.6594122598],
      [59e-11, 1.63156134967, 61306.0115970658],
      [54e-11, 4.29491690425, 21947.1113727],
      [7e-10, 0.29271565928, 6528.9074962208],
      [57e-11, 5.89190132575, 34513.2630726828],
      [54e-11, 2.51856815404, 6279.1945146334],
      [74e-11, 1.38235845304, 9967.4538999816],
      [54e-11, 0.92276712152, 6286.9571853494],
      [7e-10, 5.00933012248, 6453.7487206106],
      [53e-11, 3.86543309344, 32370.9789915656],
      [55e-11, 4.51794544854, 34911.412076091],
      [63e-11, 5.41479412056, 11502.8376165305],
      [63e-11, 2.34416220742, 11510.7019230567],
      [56e-11, 0.91310629913, 9910.583327509],
      [67e-11, 4.03308763854, 34596.3646546524],
      [6e-10, 5.57024703495, 5756.9080032458],
      [72e-11, 2.80863088166, 10866.8724834796],
      [66e-11, 6.12047940728, 12074.488407524],
      [51e-11, 2.59519527563, 11396.5634485742],
      [62e-11, 5.14746754396, 25287.7237993998],
      [54e-11, 2.50994032776, 5999.2165311262],
      [51e-11, 4.51195861837, 29822.7832363242],
      [59e-11, 0.44167237876, 250570.6758572191],
      [51e-11, 3.6884906676, 6262.7205305926],
      [49e-11, 0.54704693048, 22594.05489571199],
      [65e-11, 2.38423614501, 52670.0695933026],
      [69e-11, 5.34363738671, 66813.5648357332],
      [56e-11, 2.67216180349, 17892.93839400359],
      [49e-11, 4.18361320516, 18606.4989460002],
      [55e-11, 0.83886167974, 20452.8694122218],
      [5e-10, 1.46327331958, 37455.7264959744],
      [58e-11, 3.34847975377, 33990.6183442862],
      [65e-11, 1.45522693982, 76251.32777062019],
      [56e-11, 2.356506642, 37724.7534197482],
      [48e-11, 1.80689447612, 206.1855484372],
      [56e-11, 3.84224878744, 5483.254724826],
      [53e-11, 0.17334326094, 77717.29458646949],
      [53e-11, 0.79879700631, 77710.24834977149],
      [47e-11, 0.43240779709, 735.8765135318],
      [53e-11, 4.58786566028, 11616.976091013],
      [48e-11, 6.20230111054, 4171.4255366138],
      [52e-11, 2.9171905303, 6993.0088985497],
      [57e-11, 3.42008310383, 50317.2034395308],
      [48e-11, 0.12356889012, 13362.4497067992],
      [6e-10, 5.52056066934, 949.1756089698],
      [45e-11, 3.37963782356, 10763.779709261],
      [47e-11, 5.50958184902, 12779.4507954208],
      [52e-11, 5.42770349015, 310145.1528239236],
      [61e-11, 2.93237974631, 5791.4125575326],
      [44e-11, 2.87440620802, 8584.6616659008],
      [46e-11, 4.0314179656, 10667.8004820432],
      [44e-11, 1.21579107625, 6272.4391846416],
      [47e-11, 2.57670800912, 11492.542675792],
      [44e-11, 3.62570223167, 63658.8777508376],
      [51e-11, 0.84531181151, 12345.739057544],
      [46e-11, 1.17584556517, 149.5631971346],
      [43e-11, 0.01524970172, 37853.8754993826],
      [43e-11, 0.79038834934, 640.8776073822],
      [44e-11, 2.22554419931, 6293.7125153412],
      [49e-11, 1.01528394907, 149144.46708624958],
      [41e-11, 3.27146326065, 8858.3149443206],
      [45e-11, 3.03765521215, 65236.2212932854],
      [58e-11, 5.45843180927, 1975.492545856],
      [41e-11, 1.32190847146, 2547.8375382324],
      [47e-11, 3.67626039848, 28313.288804661],
      [47e-11, 6.21438985953, 10991.3058987006],
      [4e-10, 2.37237751212, 8273.8208670324],
      [56e-11, 1.09773690181, 77376.2010224076],
      [4e-10, 2.35698541041, 2699.7348193176],
      [43e-11, 5.28030897946, 17796.9591667858],
      [54e-11, 2.59175932091, 22910.44676536859],
      [55e-11, 0.07988985505, 83467.15635301729],
      [41e-11, 4.47510694062, 5618.3198048614],
      [4e-10, 1.35670430524, 27177.8515292002],
      [41e-11, 2.48011323946, 6549.6828917132],
      [5e-10, 2.56387920528, 82576.9812209953],
      [42e-11, 4.78798367468, 7856.89627409019],
      [47e-11, 2.75482175292, 18202.21671665939],
      [39e-11, 1.97008298629, 24491.4257925834],
      [42e-11, 4.04346599946, 7863.9425107882],
      [39e-11, 3.0103393642, 853.196381752],
      [38e-11, 0.49178679251, 38650.173506199],
      [44e-11, 1.35931241699, 21393.5419698576],
      [36e-11, 4.86047906533, 4157.1984426122],
      [43e-11, 5.64354880978, 1062.9050485382],
      [39e-11, 3.92736779879, 3903.9113764198],
      [4e-10, 5.3969491832, 9498.2122306346],
      [43e-11, 2.40863861919, 29424.634232916],
      [46e-11, 2.08022244271, 12573.2652469836],
      [5e-10, 6.15760345261, 78051.34191383338]
    ],
    "1": [
      [0.00103018607, 1.10748968172, 6283.0758499914],
      [1721238e-11, 1.06442300386, 12566.1516999828],
      [702217e-11, 3.14159265359, 0],
      [32345e-11, 1.02168583254, 18849.2275499742],
      [30801e-11, 2.84358443952, 5507.5532386674],
      [24978e-11, 1.31906570344, 5223.6939198022],
      [18487e-11, 1.42428709076, 1577.3435424478],
      [10077e-11, 5.91385248388, 10977.078804699],
      [8635e-11, 0.27158192945, 5486.777843175],
      [8654e-11, 1.42046854427, 6275.9623029906],
      [5069e-11, 1.68613408916, 5088.6288397668],
      [4985e-11, 6.01402338185, 6286.5989683404],
      [4667e-11, 5.98749245692, 529.6909650946],
      [4395e-11, 0.51800423445, 4694.0029547076],
      [387e-10, 4.74932206877, 2544.3144198834],
      [3755e-11, 5.07053801166, 796.2980068164],
      [41e-9, 1.08424801084, 9437.762934887],
      [3518e-11, 0.02290216978, 83996.84731811189],
      [3436e-11, 0.94937503872, 71430.69561812909],
      [3221e-11, 6.15628775321, 2146.1654164752],
      [3418e-11, 5.4115158188, 775.522611324],
      [2863e-11, 5.48433323746, 10447.3878396044],
      [2525e-11, 0.24296913555, 398.1490034082],
      [2205e-11, 4.94892172085, 6812.766815086],
      [2186e-11, 0.41991932164, 8031.0922630584],
      [2828e-11, 3.41986300734, 2352.8661537718],
      [2554e-11, 6.13241770582, 6438.4962494256],
      [1932e-11, 5.31374587091, 8429.2412664666],
      [2427e-11, 3.09118902115, 4690.4798363586],
      [173e-10, 1.53685999718, 4705.7323075436],
      [225e-10, 3.6883639562, 7084.8967811152],
      [2094e-11, 1.281690604, 1748.016413067],
      [1483e-11, 3.22226346483, 7234.794256242],
      [1434e-11, 0.81293662216, 14143.4952424306],
      [1754e-11, 3.22883705112, 6279.5527316424],
      [1583e-11, 4.09815978783, 11499.6562227928],
      [1575e-11, 5.53890314149, 3154.6870848956],
      [1847e-11, 1.82041234937, 7632.9432596502],
      [1499e-11, 3.63177937611, 11513.8833167944],
      [1337e-11, 4.64442556061, 6836.6452528338],
      [1275e-11, 2.69329661394, 1349.8674096588],
      [1348e-11, 6.15284035323, 5746.271337896],
      [1126e-11, 3.35676107739, 17789.845619785],
      [147e-10, 3.65282991735, 1194.4470102246],
      [1101e-11, 4.4974742767, 4292.3308329504],
      [1168e-11, 2.58033028504, 13367.9726311066],
      [1236e-11, 5.64980098028, 5760.4984318976],
      [985e-11, 0.65326301914, 5856.4776591154],
      [928e-11, 2.3255501829, 10213.285546211],
      [1073e-11, 5.82672338169, 12036.4607348882],
      [918e-11, 0.76907130762, 16730.4636895958],
      [876e-11, 1.50335727807, 11926.2544136688],
      [1023e-11, 5.62071200879, 6256.7775301916],
      [853e-11, 0.6567813463, 155.4203994342],
      [802e-11, 4.10519132094, 951.7184062506],
      [859e-11, 1.42880883564, 5753.3848848968],
      [992e-11, 1.1423800161, 1059.3819301892],
      [814e-11, 1.63584008733, 6681.2248533996],
      [664e-11, 4.55039663226, 5216.5803728014],
      [627e-11, 1.50782904323, 5643.1785636774],
      [644e-11, 4.19480024859, 6040.3472460174],
      [59e-10, 6.18371704849, 4164.311989613],
      [635e-11, 0.5242358477, 6290.1893969922],
      [65e-10, 0.97935492869, 25132.3033999656],
      [568e-11, 2.30121525349, 10973.55568635],
      [549e-11, 5.26737827342, 3340.6124266998],
      [547e-11, 2.20143332641, 1592.5960136328],
      [526e-11, 0.92464258271, 11371.7046897582],
      [493e-11, 5.91036281399, 3894.1818295422],
      [483e-11, 1.6600571154, 12168.0026965746],
      [514e-11, 3.59683072524, 10969.9652576982],
      [516e-11, 3.97164781773, 17298.1823273262],
      [529e-11, 5.0353867768, 9917.6968745098],
      [487e-11, 2.50544745305, 6127.6554505572],
      [419e-11, 4.05235655996, 10984.1923516998],
      [538e-11, 5.54081539813, 553.5694028424],
      [402e-11, 2.16859478359, 7860.4193924392],
      [552e-11, 2.32219865498, 11506.7697697936],
      [367e-11, 3.39145698451, 6496.3749454294],
      [36e-10, 5.34467204596, 7079.3738568078],
      [334e-11, 3.61346365667, 11790.6290886588],
      [454e-11, 0.28755421898, 801.8209311238],
      [419e-11, 3.69613970002, 10575.4066829418],
      [319e-11, 0.30793759304, 16200.7727245012],
      [376e-11, 5.81560210508, 7058.5984613154],
      [364e-11, 1.08425056923, 6309.3741697912],
      [294e-11, 4.54798604178, 11856.2186514245],
      [29e-10, 1.26451946335, 8635.9420037632],
      [394e-11, 4.15683669084, 26.2983197998],
      [26e-10, 5.09424572996, 10177.2576795336],
      [241e-11, 2.25766000302, 11712.9553182308],
      [239e-11, 1.06936978753, 242.728603974],
      [276e-11, 3.44260568764, 5884.9268465832],
      [255e-11, 5.38496803122, 21228.3920235458],
      [307e-11, 4.24313885601, 3738.761430108],
      [213e-11, 3.44661200485, 213.299095438],
      [198e-11, 0.69427265195, 1990.745017041],
      [195e-11, 5.16563409007, 12352.8526045448],
      [213e-11, 3.89937836808, 13916.0191096416],
      [214e-11, 4.00445200772, 5230.807466803],
      [184e-11, 5.59805976614, 6283.14316029419],
      [184e-11, 2.85275392124, 7238.6755916],
      [179e-11, 2.54259058252, 14314.1681130498],
      [236e-11, 5.58826125715, 6069.7767545534],
      [189e-11, 2.72689937708, 6062.6632075526],
      [184e-11, 6.04216273598, 6283.0085396886],
      [225e-11, 1.66128561344, 4732.0306273434],
      [23e-10, 3.62591335086, 6284.0561710596],
      [172e-11, 0.97566476085, 3930.2096962196],
      [162e-11, 2.19467339429, 18073.7049386502],
      [215e-11, 1.04672844028, 3496.032826134],
      [182e-11, 5.17782354566, 17253.04110768959],
      [167e-11, 2.17754938066, 6076.8903015542],
      [167e-11, 4.75672473773, 17267.26820169119],
      [149e-11, 0.80944185798, 709.9330485583],
      [149e-11, 0.17584214812, 9779.1086761254],
      [192e-11, 5.00680790235, 11015.1064773348],
      [141e-11, 4.38420380014, 4136.9104335162],
      [158e-11, 4.60969054283, 9623.6882766912],
      [133e-11, 3.30507062245, 154717.6098876827],
      [166e-11, 6.13191098325, 3.523118349],
      [181e-11, 1.60715321141, 7.1135470008],
      [15e-10, 5.28136702046, 13517.8701062334],
      [142e-11, 0.49788089569, 25158.6017197654],
      [124e-11, 6.03440459813, 9225.539273283],
      [124e-11, 0.99251562639, 65147.6197681377],
      [128e-11, 1.92032744711, 22483.84857449259],
      [124e-11, 3.99739675184, 4686.8894077068],
      [121e-11, 2.37814805239, 167283.7615876655],
      [123e-11, 5.6231511294, 5642.1982426092],
      [117e-11, 5.81755956156, 12569.6748183318],
      [157e-11, 3.40236948518, 16496.3613962024],
      [13e-10, 2.10499918142, 1589.0728952838],
      [116e-11, 0.55839966736, 5849.3641121146],
      [123e-11, 5.81645568991, 6282.0955289232],
      [11e-10, 0.42176497674, 6172.869528772],
      [15e-10, 4.26279600865, 3128.3887650958],
      [106e-11, 2.27436561182, 5429.8794682394],
      [114e-11, 1.52894564202, 12559.038152982],
      [121e-11, 0.39459045915, 12132.439962106],
      [104e-11, 2.41845930933, 426.598190876],
      [109e-11, 5.82786999856, 16858.4825329332],
      [102e-11, 4.4662648491, 23543.23050468179],
      [1e-9, 2.93812275274, 4535.0594369244],
      [97e-11, 3.97935904984, 6133.5126528568],
      [98e-11, 0.87616810121, 6525.8044539654],
      [11e-10, 6.22339014386, 12146.6670561076],
      [98e-11, 3.17344332543, 10440.2742926036],
      [96e-11, 2.44128701699, 3097.88382272579],
      [99e-11, 5.75642493267, 7342.4577801806],
      [9e-10, 0.18984343165, 13119.72110282519],
      [99e-11, 5.58884724219, 2388.8940204492],
      [91e-11, 6.04278320182, 20426.571092422],
      [8e-10, 1.29028142103, 5650.2921106782],
      [86e-11, 3.94529200528, 10454.5013866052],
      [85e-11, 1.92836879835, 29088.811415985],
      [76e-11, 2.70726317966, 143571.32428481648],
      [91e-11, 5.63859073351, 8827.3902698748],
      [76e-11, 1.80783856698, 28286.9904848612],
      [75e-11, 3.40858032804, 5481.2549188676],
      [7e-10, 4.53719487231, 17256.6315363414],
      [89e-11, 1.10064490942, 11769.8536931664],
      [66e-11, 2.78384937771, 536.8045120954],
      [68e-11, 3.88199295043, 17260.1546546904],
      [88e-11, 3.88075269535, 7477.522860216],
      [61e-11, 6.17558202197, 11087.2851259184],
      [6e-10, 4.34824715818, 6206.8097787158],
      [82e-11, 4.59843208943, 9388.0059094152],
      [79e-11, 1.63139280394, 4933.2084403326],
      [81e-11, 1.55550779371, 9380.9596727172],
      [78e-11, 4.20905757519, 5729.506447149],
      [58e-11, 5.76889633224, 3634.6210245184],
      [6e-10, 0.93813100594, 12721.572099417],
      [71e-11, 6.11408885148, 8662.240323563],
      [57e-11, 5.48112524468, 18319.5365848796],
      [7e-10, 0.01749174864, 14945.3161735544],
      [74e-11, 1.0997604582, 16460.33352952499],
      [56e-11, 1.63036186739, 15720.8387848784],
      [55e-11, 4.86788348404, 13095.8426650774],
      [6e-10, 5.93729841267, 12539.853380183],
      [54e-11, 0.22608242982, 15110.4661198662],
      [54e-11, 2.30250047594, 16062.1845261168],
      [64e-11, 2.13513754101, 7875.6718636242],
      [59e-11, 5.87963500139, 5331.3574437408],
      [58e-11, 2.30546168615, 955.5997416086],
      [49e-11, 1.93839278478, 5333.9002410216],
      [54e-11, 5.80331607119, 12043.574281889],
      [54e-11, 4.44671053809, 4701.1165017084],
      [49e-11, 0.30241161485, 6805.6532680852],
      [46e-11, 2.76898193028, 6709.6740408674],
      [46e-11, 3.98449608961, 98068.53671630539],
      [49e-11, 3.72022009896, 12323.4230960088],
      [45e-11, 3.30065998328, 22003.9146348698],
      [48e-11, 0.71071357303, 6303.4311693902],
      [61e-11, 1.66030429494, 6262.300454499],
      [47e-11, 1.26317154881, 11919.140866668],
      [51e-11, 1.08020906825, 10988.808157535],
      [45e-11, 0.89150445122, 51868.2486621788],
      [43e-11, 0.57756724285, 24356.7807886416],
      [43e-11, 1.61526242998, 6277.552925684],
      [45e-11, 2.96132920534, 8982.810669309],
      [43e-11, 5.74295325645, 11403.676995575],
      [55e-11, 3.14274403422, 33019.0211122046],
      [57e-11, 0.06379726305, 15671.0817594066],
      [41e-11, 2.53761820726, 6262.7205305926],
      [4e-10, 1.53130436944, 18451.07854656599],
      [52e-11, 1.71451922581, 1551.045222648],
      [55e-11, 0.89439119424, 11933.3679606696],
      [45e-11, 3.88495384656, 60530.4889857418],
      [4e-10, 4.75740908001, 38526.574350872],
      [4e-10, 3.77498297348, 26087.9031415742],
      [39e-11, 2.97113832621, 2118.7638603784],
      [4e-10, 3.36050962605, 10021.8372800994],
      [47e-11, 1.67051113434, 6303.8512454838],
      [52e-11, 5.21827368711, 77713.7714681205],
      [47e-11, 4.26356628717, 21424.4666443034],
      [37e-11, 1.66712389942, 6819.8803620868],
      [37e-11, 0.65746800933, 12029.3471878874],
      [35e-11, 3.36255650927, 24072.9214697764],
      [36e-11, 0.11087914947, 10344.2950653858],
      [4e-10, 4.14725582115, 2787.0430238574],
      [35e-11, 5.93650887012, 31570.7996493912],
      [36e-11, 2.15108874765, 30774.5016425748],
      [36e-11, 1.75078825382, 16207.886271502],
      [34e-11, 2.75708224536, 12139.5535091068],
      [34e-11, 6.168913788, 24491.4257925834],
      [34e-11, 2.31528650443, 55798.4583583984],
      [32e-11, 4.21446357042, 15664.03552270859],
      [34e-11, 3.19783054699, 32217.2001810808],
      [39e-11, 1.24979117796, 6418.1409300268],
      [38e-11, 5.89832942685, 640.8776073822],
      [33e-11, 4.80200120107, 16723.350142595],
      [32e-11, 1.72442327688, 27433.88921587499],
      [35e-11, 4.44608896525, 18202.21671665939],
      [31e-11, 4.5279073128, 6702.5604938666],
      [34e-11, 3.96287980676, 18216.443810661],
      [3e-10, 5.06259854444, 226858.23855437007],
      [34e-11, 1.43910280005, 49515.382508407],
      [3e-10, 0.29303163371, 13521.7514415914],
      [29e-11, 2.0263384022, 11609.8625440122],
      [3e-10, 2.5492323024, 9924.8104215106],
      [32e-11, 4.91793198558, 11300.5842213564],
      [3e-10, 0.23284423547, 23581.2581773176],
      [29e-11, 1.62807736495, 639.897286314],
      [28e-11, 3.84568936822, 2699.7348193176],
      [29e-11, 1.83149729794, 29822.7832363242],
      [33e-11, 4.60320094415, 19004.6479494084],
      [27e-11, 1.86151121799, 6288.5987742988],
      [3e-10, 4.4649407224, 36147.4098773004],
      [28e-11, 5.19684492912, 5863.5912061162],
      [35e-11, 4.52695674113, 36949.2308084242],
      [27e-11, 3.52528177609, 10770.8932562618],
      [26e-11, 1.48499438453, 11080.1715789176],
      [35e-11, 2.82154380962, 19402.7969528166],
      [25e-11, 2.46339998836, 6279.4854213396],
      [26e-11, 4.97688894643, 16737.5772365966],
      [27e-11, 0.408271125, 12964.300703391],
      [29e-11, 4.15148654061, 45892.73043315699],
      [26e-11, 4.56404104286, 17796.9591667858],
      [25e-11, 2.89309528854, 6286.6662786432],
      [26e-11, 4.82914580957, 1066.49547719],
      [31e-11, 3.93096113738, 29864.334027309],
      [24e-11, 6.14987193584, 18606.4989460002],
      [24e-11, 3.74225964547, 29026.48522950779],
      [25e-11, 5.70460621565, 27707.5424942948],
      [25e-11, 5.33928840652, 15141.390794312],
      [23e-11, 2.37624087345, 17996.0311682222],
      [26e-11, 1.34231351782, 18875.525869774],
      [22e-11, 5.5079162612, 6245.0481773556],
      [24e-11, 1.33998410121, 19800.9459562248],
      [23e-11, 0.2251228089, 6279.7894925736],
      [22e-11, 1.17576471775, 11925.2740926006],
      [22e-11, 3.5860360664, 6915.8595893046],
      [23e-11, 3.21621246666, 6286.3622074092],
      [29e-11, 2.09564449439, 15265.8865193004],
      [22e-11, 4.74660932338, 28230.18722269139],
      [21e-11, 2.30688751432, 5999.2165311262],
      [28e-11, 3.92087592807, 18208.349942592],
      [21e-11, 3.22643339385, 25934.1243310894],
      [21e-11, 3.04956726238, 6566.9351688566],
      [27e-11, 5.35645770522, 33794.5437235286],
      [25e-11, 5.91542362188, 6489.2613984286],
      [2e-10, 1.52296293311, 135.0650800354],
      [19e-11, 1.78134428631, 156137.47598479927],
      [19e-11, 0.34388684087, 5327.4761083828],
      [26e-11, 3.41701003233, 25287.7237993998],
      [19e-11, 2.86664271911, 18422.62935909819],
      [19e-11, 4.71432851499, 77690.75950573849],
      [19e-11, 2.54227398241, 77736.78343050249],
      [2e-10, 5.91915117116, 48739.859897083]
    ],
    "2": [
      [4359385e-11, 5.78455133808, 6283.0758499914],
      [123633e-11, 5.57935427994, 12566.1516999828],
      [12342e-11, 3.14159265359, 0],
      [8792e-11, 3.62777893099, 77713.7714681205],
      [5689e-11, 1.86958905084, 5573.1428014331],
      [3302e-11, 5.47034879713, 18849.2275499742],
      [1471e-11, 4.47964125007, 5507.5532386674],
      [1013e-11, 2.81323115556, 5223.6939198022],
      [854e-11, 3.107765669, 1577.3435424478],
      [1102e-11, 2.84173992403, 161000.6857376741],
      [648e-11, 5.47348203398, 775.522611324],
      [608e-11, 1.37894173533, 6438.4962494256],
      [499e-11, 4.4164924225, 6286.5989683404],
      [416e-11, 0.90332697974, 10977.078804699],
      [404e-11, 3.2056726953, 5088.6288397668],
      [351e-11, 1.81081728907, 5486.777843175],
      [466e-11, 3.65086758149, 7084.8967811152],
      [458e-11, 5.38585314743, 149854.4001348079],
      [304e-11, 3.51015066341, 796.2980068164],
      [266e-11, 6.17413982699, 6836.6452528338],
      [281e-11, 1.8387467254, 4694.0029547076],
      [262e-11, 1.41420110644, 2146.1654164752],
      [264e-11, 3.14103683911, 71430.69561812909],
      [319e-11, 5.35037932146, 3154.6870848956],
      [238e-11, 2.17695432424, 155.4203994342],
      [229e-11, 4.7596958807, 7234.794256242],
      [291e-11, 4.61776401638, 4690.4798363586],
      [211e-11, 0.21864885298, 4705.7323075436],
      [204e-11, 4.22895113488, 1349.8674096588],
      [195e-11, 4.58550676556, 529.6909650946],
      [255e-11, 2.81442711144, 1748.016413067],
      [182e-11, 5.70454011389, 6040.3472460174],
      [18e-10, 6.02147727878, 4292.3308329504],
      [186e-11, 1.58690991244, 6309.3741697912],
      [167e-11, 2.88802733052, 9437.762934887],
      [166e-11, 1.99990574734, 8031.0922630584],
      [16e-10, 0.04412738495, 2544.3144198834],
      [197e-11, 2.01089431842, 1194.4470102246],
      [165e-11, 5.78372596774, 83996.84731811189],
      [214e-11, 3.38300910371, 7632.9432596502],
      [14e-10, 0.36669664351, 10447.3878396044],
      [151e-11, 0.95519595275, 6127.6554505572],
      [136e-11, 1.48417295645, 2352.8661537718],
      [128e-11, 5.48057748834, 951.7184062506],
      [126e-11, 5.26866506592, 6279.5527316424],
      [127e-11, 3.77552907014, 6812.766815086],
      [103e-11, 4.95897533789, 398.1490034082],
      [104e-11, 0.70183576826, 1592.5960136328],
      [101e-11, 1.14481598642, 3894.1818295422],
      [131e-11, 0.76624310306, 553.5694028424],
      [109e-11, 5.41063597567, 6256.7775301916],
      [78e-11, 5.84775340741, 242.728603974],
      [97e-11, 1.94685257714, 11856.2186514245],
      [1e-9, 5.19725292131, 244287.60000722768],
      [76e-11, 0.70480774041, 8429.2412664666],
      [8e-10, 6.18430772683, 1059.3819301892],
      [68e-11, 5.29561709093, 14143.4952424306],
      [85e-11, 5.39487308005, 25132.3033999656],
      [55e-11, 5.16874637579, 7058.5984613154],
      [63e-11, 0.48494730699, 801.8209311238],
      [58e-11, 4.07254840265, 13367.9726311066],
      [51e-11, 3.89696552232, 12036.4607348882],
      [51e-11, 5.56335232286, 1990.745017041],
      [6e-10, 2.2504659671, 8635.9420037632],
      [49e-11, 5.58163417371, 6290.1893969922],
      [51e-11, 3.87240194908, 26.2983197998],
      [51e-11, 4.19300909995, 7860.4193924392],
      [41e-11, 3.97169191582, 10973.55568635],
      [41e-11, 3.5708091923, 7079.3738568078],
      [56e-11, 2.76959005761, 90955.5516944961],
      [42e-11, 1.91461189163, 7477.522860216],
      [42e-11, 0.42775891995, 10213.285546211],
      [42e-11, 1.06925480488, 709.9330485583],
      [38e-11, 6.17935925345, 9917.6968745098],
      [5e-10, 0.81691517401, 11506.7697697936],
      [53e-11, 1.45828359397, 233141.3144043615],
      [38e-11, 3.32444534628, 5643.1785636774],
      [47e-11, 6.21543665927, 6681.2248533996],
      [37e-11, 0.3635930998, 10177.2576795336],
      [45e-11, 5.29587706357, 10575.4066829418],
      [34e-11, 5.63446915337, 6525.8044539654],
      [34e-11, 5.36385158519, 4933.2084403326],
      [35e-11, 5.36152295839, 25158.6017197654],
      [42e-11, 5.08837645072, 11015.1064773348],
      [42e-11, 4.22496037505, 88860.05707098669],
      [39e-11, 1.99171699618, 6284.0561710596],
      [29e-11, 3.1908862817, 11926.2544136688],
      [29e-11, 0.14996158324, 12168.0026965746],
      [3e-10, 1.58346276808, 9779.1086761254],
      [26e-11, 4.16210340581, 12569.6748183318],
      [36e-11, 2.74684637873, 3738.761430108],
      [26e-11, 0.7282491532, 1589.0728952838],
      [31e-11, 5.34906371821, 143571.32428481648],
      [25e-11, 0.10240267494, 22483.84857449259],
      [3e-10, 3.47110495524, 14945.3161735544],
      [26e-11, 3.89359701125, 5753.3848848968],
      [24e-11, 1.18744224678, 4535.0594369244],
      [33e-11, 2.99317143244, 3930.2096962196],
      [24e-11, 1.57253767584, 6496.3749454294],
      [24e-11, 3.47434797542, 4136.9104335162],
      [22e-11, 3.91230073719, 6275.9623029906],
      [25e-11, 4.02978941287, 3128.3887650958],
      [23e-11, 1.07724492065, 12721.572099417],
      [21e-11, 1.89591807148, 16730.4636895958],
      [25e-11, 2.42198937013, 5729.506447149],
      [2e-10, 1.78163489101, 17789.845619785],
      [21e-11, 0.49258939822, 29088.811415985],
      [26e-11, 4.14947806747, 2388.8940204492],
      [27e-11, 2.54785812264, 3496.032826134],
      [2e-10, 4.29944129273, 16858.4825329332],
      [21e-11, 5.97796936723, 7.1135470008],
      [19e-11, 0.80292033311, 16062.1845261168],
      [24e-11, 4.89894141052, 17260.1546546904],
      [25e-11, 1.37003752175, 6282.0955289232],
      [22e-11, 4.92663152168, 18875.525869774],
      [23e-11, 5.68902059771, 16460.33352952499],
      [23e-11, 3.03021283729, 66567.48586525429],
      [16e-11, 3.89713736666, 5331.3574437408],
      [16e-11, 5.68562539832, 12559.038152982],
      [16e-11, 3.95085099736, 3097.88382272579],
      [16e-11, 3.99041783945, 6283.14316029419],
      [2e-10, 6.106439191, 167283.7615876655],
      [15e-11, 4.09775914607, 11712.9553182308],
      [16e-11, 5.717699407, 17298.1823273262],
      [16e-11, 3.28894009404, 5884.9268465832],
      [15e-11, 4.4256424368, 13517.8701062334],
      [16e-11, 4.4345208093, 6283.0085396886],
      [14e-11, 1.44384279999, 4164.311989613],
      [14e-11, 4.47380919159, 11790.6290886588],
      [14e-11, 4.77646531825, 7342.4577801806],
      [11e-11, 2.56768522896, 5481.2549188676],
      [11e-11, 1.514433322, 16200.7727245012],
      [11e-11, 0.88708889185, 21228.3920235458],
      [14e-11, 4.50116508534, 640.8776073822]
    ],
    "3": [
      [144595e-11, 4.27319433901, 6283.0758499914],
      [6729e-11, 3.91706261708, 12566.1516999828],
      [774e-11, 0, 0],
      [247e-11, 3.73021571217, 18849.2275499742],
      [36e-11, 2.8008140905, 6286.5989683404],
      [33e-11, 5.62990083112, 6127.6554505572],
      [18e-11, 3.72826142555, 6438.4962494256],
      [16e-11, 4.26011484232, 6525.8044539654],
      [14e-11, 3.47817116396, 6256.7775301916],
      [12e-11, 3.55747379482, 25132.3033999656],
      [1e-10, 4.43995693209, 4705.7323075436],
      [1e-10, 4.2804525547, 83996.84731811189],
      [9e-11, 5.36457057335, 6040.3472460174],
      [8e-11, 1.78458957263, 5507.5532386674],
      [9e-11, 0.4727519993, 6279.5527316424],
      [9e-11, 1.34741231639, 6309.3741697912],
      [9e-11, 0.77092900708, 5729.506447149],
      [7e-11, 3.50146897332, 7058.5984613154],
      [5e-11, 2.890710617, 775.522611324],
      [6e-11, 2.36514111314, 6836.6452528338]
    ],
    "4": [
      [3858e-11, 2.56389016346, 6283.0758499914],
      [306e-11, 2.26911740541, 12566.1516999828],
      [53e-11, 3.44031471924, 5573.1428014331],
      [15e-11, 2.03136359366, 18849.2275499742],
      [13e-11, 2.05688873673, 77713.7714681205],
      [7e-11, 4.4121885448, 161000.6857376741],
      [4e-11, 5.33854414781, 6438.4962494256],
      [6e-11, 3.81514213664, 149854.4001348079],
      [4e-11, 4.26602478239, 6127.6554505572]
    ],
    "5": [
      [86e-11, 1.21805304895, 6283.0758499914],
      [12e-11, 0.65572878044, 12566.1516999828]
    ]
  },
  name: "earth",
  type: "B"
};
var vsop87Bearth_default = m2;

// node_modules/date-chinese/src/vsop87Bearth.js
var vsop87Bearth = vsop87Bearth_default;

// node_modules/date-chinese/src/Chinese.js
var earth2 = new planetposition_default.Planet(vsop87Bearth);
var lunarOffset = moonphase_default.meanLunarMonth / 2;
var p2 = 180 / Math.PI;
var epochY = -2636;
var epoch = new julian_default.CalendarGregorian(epochY, 2, 15).toJDE();
function toYear(jde) {
  return new julian_default.CalendarGregorian().fromJDE(jde).toYear();
}
function toFixed(val, e) {
  return parseFloat(val.toFixed(e), 10);
}
var CalendarChinese = class _CalendarChinese {
  /**
   * constructor
   *
   * @param {Number|Array|Object} cycle - chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`
   * @param {Number} year - chinese year of cycle
   * @param {Number} month - chinese month
   * @param {Number} leap - `true` if leap month
   * @param {Number} day - chinese day
   */
  constructor(cycle, year, month, leap, day) {
    this.set(cycle, year, month, leap, day);
    this._epochY = epochY;
    this._epoch = epoch;
    this._cache = {
      // cache for results
      lon: {},
      sue: {},
      ny: {}
    };
  }
  /**
   * set a new chinese date
   *
   * @param {Number|Array|Object} cycle - chinese 60 year cicle; if `{Array}` than `[cycle, year, ..., day]`
   * @param {Number} year - chinese year of cycle
   * @param {Number} month - chinese month
   * @param {Number} leap - `true` if leap month
   * @param {Number} day - chinese day
   */
  set(cycle, year, month, leap, day) {
    if (cycle instanceof _CalendarChinese) {
      this.cycle = cycle.cycle;
      this.year = cycle.year;
      this.month = cycle.month;
      this.leap = cycle.leap;
      this.day = cycle.day;
    } else if (Array.isArray(cycle)) {
      this.cycle = cycle[0];
      this.year = cycle[1];
      this.month = cycle[2];
      this.leap = cycle[3];
      this.day = cycle[4];
    } else {
      this.cycle = cycle;
      this.year = year;
      this.month = month;
      this.leap = leap;
      this.day = day;
    }
    return this;
  }
  /**
   * returns chinese date
   * @returns {Array}
   */
  get() {
    return [this.cycle, this.year, this.month, this.leap, this.day];
  }
  /**
   * get Gregorian year from Epoch / Cycle
   * @return {Number} year
   */
  yearFromEpochCycle() {
    return this._epochY + (this.cycle - 1) * 60 + (this.year - 1);
  }
  /**
   * convert gregorian date to chinese calendar date
   *
   * @param {Number} year - (int) year in Gregorian or Julian Calendar
   * @param {Number} month - (int)
   * @param {Number} day - needs to be in correct (chinese) timezone
   * @return {Object} this
   */
  fromGregorian(year, month, day) {
    const j = this.midnight(new julian_default.CalendarGregorian(year, month, day).toJDE());
    if (month === 1 && day <= 20) year--;
    this._from(j, year);
    return this;
  }
  /**
   * convert date to chinese calendar date
   *
   * @param {Date} date - javascript date object
   * @return {Object} this
   */
  fromDate(date) {
    const j = this.midnight(new julian_default.CalendarGregorian().fromDate(date).toJDE());
    this._from(j, date.getFullYear());
    return this;
  }
  /**
   * convert JDE to chinese calendar date
   *
   * @param {Number} jde - date in JDE
   * @return {Object} this
   */
  fromJDE(jde) {
    const j = this.midnight(jde);
    const gc = new julian_default.CalendarGregorian().fromJDE(j);
    if (gc.month === 1 && gc.day < 20) gc.year--;
    this._from(j, gc.year);
    return this;
  }
  /**
   * common conversion from JDE, year to chinese date
   *
   * @private
   * @param {Number} j - date in JDE
   * @param {Number} year - gregorian year
   */
  _from(j, year) {
    let ny = this.newYear(year);
    if (ny > j) {
      ny = this.newYear(year - 1);
    }
    let nm = this.previousNewMoon(j);
    if (nm < ny) {
      nm = ny;
    }
    const years = 1.5 + (ny - this._epoch) / base_default.BesselianYear;
    this.cycle = 1 + Math.trunc((years - 1) / 60);
    this.year = 1 + Math.trunc((years - 1) % 60);
    this.month = this.inMajorSolarTerm(nm).term;
    const m3 = Math.round((nm - ny) / moonphase_default.meanLunarMonth);
    if (m3 === 0) {
      this.month = 1;
      this.leap = false;
    } else {
      this.leap = this.isLeapMonth(nm);
    }
    if (m3 > this.month) {
      this.month = m3;
    } else if (this.leap) {
      this.month--;
    }
    this.day = 1 + Math.trunc(toFixed(j, 3) - toFixed(nm, 3));
  }
  /**
   * convert chinese date to gregorian date
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Object} date in gregorian (preleptic) calendar; Timezone is Standard Chinese / Bejing Time
   *   {Number} year - (int)
   *   {Number} month - (int)
   *   {Number} day - (int)
   */
  toGregorian(gyear) {
    const jde = this.toJDE(gyear);
    const gc = new julian_default.CalendarGregorian().fromJDE(jde + 0.5);
    return {
      year: gc.year,
      month: gc.month,
      day: Math.trunc(gc.day)
    };
  }
  /**
   * convert chinese date to Date
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Date} javascript date object in gregorian (preleptic) calendar
   */
  toDate(gyear) {
    const jde = this.toJDE(gyear);
    return new julian_default.CalendarGregorian().fromJDE(toFixed(jde, 4)).toDate();
  }
  /**
   * convert chinese date to JDE
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @return {Number} date in JDE
   */
  toJDE(gyear) {
    const years = gyear || this.yearFromEpochCycle();
    const ny = this.newYear(years);
    let nm = ny;
    if (this.month > 1) {
      nm = this.previousNewMoon(ny + this.month * 29);
      const st = this.inMajorSolarTerm(nm).term;
      const lm = this.isLeapMonth(nm);
      if (st > this.month) {
        nm = this.previousNewMoon(nm - 1);
      } else if (st < this.month || lm && !this.leap) {
        nm = this.nextNewMoon(nm + 1);
      }
    }
    if (this.leap) {
      nm = this.nextNewMoon(nm + 1);
    }
    const jde = nm + this.day - 1;
    return jde;
  }
  /**
   * timeshift to UTC
   *
   * @param {CalendarGregorian} gcal - gregorian calendar date
   * @return {Number} timeshift in fraction of day
   */
  timeshiftUTC(gcal) {
    if (gcal.toYear() >= 1929) {
      return 8 / 24;
    }
    return 1397 / 180 / 24;
  }
  /**
   * time/date at midnight - truncate `jde` to actual day
   *
   * @param {Number} jde - julian ephemeris day
   * @return {Number} truncated jde
   */
  midnight(jde) {
    const gcal = new julian_default.CalendarGregorian().fromJDE(jde);
    const ts = 0.5 - this.timeshiftUTC(gcal);
    let mn2 = Math.trunc(gcal.toJD() - ts) + ts;
    mn2 = gcal.fromJD(mn2).toJDE();
    if (toFixed(jde, 5) === toFixed(mn2, 5) + 1) {
      return jde;
    }
    return mn2;
  }
  /**
   * get major solar term `Z1...Z12` for a given date in JDE
   *
   * @param {Number} jde - date of new moon
   * @returns {Number} major solar term part of that month
   */
  inMajorSolarTerm(jde) {
    const lon = this._cache.lon[jde] || solar_default.apparentVSOP87(earth2, jde).lon;
    this._cache.lon[jde] = lon;
    const lonDeg = lon * p2 - 1e-13;
    const term = (2 + Math.floor(lonDeg / 30)) % 12 + 1;
    return { term, lon: lonDeg };
  }
  /**
   * Test if date `jde` is inside a leap month
   * `jde` and previous new moon need to have the same major solar term
   *
   * @param {Number} jde - date of new moon
   * @returns {Boolean} `true` if previous new moon falls into same solar term
   */
  isLeapMonth(jde) {
    const t1 = this.inMajorSolarTerm(jde);
    const next = this.nextNewMoon(this.midnight(jde + lunarOffset));
    const t2 = this.inMajorSolarTerm(next);
    const r = t1.term === t2.term;
    return r;
  }
  /**
   * next new moon since `jde`
   *
   * @param {Number} jde - date in julian ephemeris days
   * @return {Number} jde at midnight
   */
  nextNewMoon(jde) {
    let nm = this.midnight(moonphase_default.newMoon(toYear(jde)));
    let cnt = 0;
    while (nm < jde && cnt++ < 4) {
      nm = this.midnight(moonphase_default.newMoon(toYear(jde + cnt * lunarOffset)));
    }
    return nm;
  }
  /**
   * next new moon since `jde`
   *
   * @param {Number} jde - date in julian ephemeris days
   * @return {Number} jde at midnight
   */
  previousNewMoon(jde) {
    let nm = this.midnight(moonphase_default.newMoon(toYear(jde)));
    let cnt = 0;
    while (nm > jde && cnt++ < 4) {
      nm = this.midnight(moonphase_default.newMoon(toYear(jde - cnt * lunarOffset)));
    }
    return nm;
  }
  /**
   * chinese new year for a given gregorian year
   *
   * @param {Number} gyear - gregorian year (int)
   * @param {Number} jde at midnight
   */
  newYear(gyear) {
    gyear = Math.trunc(gyear);
    if (this._cache.ny[gyear]) return this._cache.ny[gyear];
    const sue1 = this._cache.sue[gyear - 1] || solstice_default.december2(gyear - 1, earth2);
    const sue2 = this._cache.sue[gyear] || solstice_default.december2(gyear, earth2);
    this._cache.sue[gyear - 1] = sue1;
    this._cache.sue[gyear] = sue2;
    const m11n = this.previousNewMoon(this.midnight(sue2 + 1));
    const m12 = this.nextNewMoon(this.midnight(sue1 + 1));
    const m13 = this.nextNewMoon(this.midnight(m12 + lunarOffset));
    this.leapSui = Math.round((m11n - m12) / moonphase_default.meanLunarMonth) === 12;
    let ny = m13;
    if (this.leapSui && (this.isLeapMonth(m12) || this.isLeapMonth(m13))) {
      ny = this.nextNewMoon(this.midnight(m13 + moonphase_default.meanLunarMonth / 2));
    }
    this._cache.ny[gyear] = ny;
    return ny;
  }
  /**
   * get solar term from solar longitude
   *
   * @param {Number} term - jiéqì solar term 1 .. 24
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  solarTerm(term, gyear) {
    if (gyear && term <= 3) gyear--;
    const years = gyear || this.yearFromEpochCycle();
    const lon = (term + 20) % 24 * 15 % 360;
    let st = solstice_default.longitude(years, earth2, lon / p2);
    st = this.midnight(st);
    return st;
  }
  /**
   * get major solar term
   *
   * @param {Number} term - zhōngqì solar term Z1 .. Z12
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  majorSolarTerm(term, gyear) {
    return this.solarTerm(term * 2, gyear);
  }
  /**
   * get minor solar term
   *
   * @param {Number} term - jiéqì solar term J1 .. J12
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  minorSolarTerm(term, gyear) {
    return this.solarTerm(term * 2 - 1, gyear);
  }
  /**
   * Qı̄ngmíng - Pure brightness Festival
   *
   * @param {Number} [gyear] - (int) gregorian year
   * @returns {Number} jde at midnight
   */
  qingming(gyear) {
    return this.solarTerm(5, gyear);
  }
};

// node_modules/date-chinese/src/Korean.js
var epochY2 = -2333;
var epoch2 = new julian_default.CalendarGregorian(epochY2, 1, 27).toJDE();
var UTC_DATES = [
  {
    date: /* @__PURE__ */ new Date("1961-10-09T15:00:00.000Z"),
    // 1961-10-10T00:00:00+0900
    shift: 9 / 24
  },
  // +9:00:00h (135° East)
  {
    date: /* @__PURE__ */ new Date("1954-03-20T15:30:00.000Z"),
    // 1954-03-21T00:00:00+0830
    shift: 8.5 / 24
  },
  {
    date: /* @__PURE__ */ new Date("1911-12-31T15:00:00.000Z"),
    // 1912-01-01T00:00:00+0900
    shift: 9 / 24
  },
  {
    date: /* @__PURE__ */ new Date("1908-03-31T15:30:00.000Z"),
    // 1908-04-01T00:00:00+0830
    shift: 8.5 / 24
  }
];

// node_modules/date-chinese/src/Japanese.js
var UTC_DATES2 = [
  {
    date: /* @__PURE__ */ new Date("1888-02-11T15:00:00.000Z"),
    // 1888-02-12T00:00:00+0900
    shift: 9 / 24
  }
  // +9:00:00h (135° East) Japanese standard meridian
];

// assets/js/Datetime.js
var RADIAN_CONVERSION = Math.PI / 180;
var J2000_EPOCH = 94672800;
var NEW_MOON_EPOCH = 1633518300;
var LUNAR_CYCLE = 29.53059;
var SECONDS_PER_DAY = 86400;
var rad = (deg) => deg * RADIAN_CONVERSION;
var sin10 = (x) => Math.sin(rad(x));
var floor = Math.floor;
var STEMS = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"];
var BRANCHES = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
var CMONTH = [
  "\u7AEF\u6708",
  "\u674F\u6708",
  "\u6843\u6708",
  "\u6885\u6708",
  "\u69B4\u6708",
  "\u8354\u6708",
  "\u862D\u6708",
  "\u6842\u6708",
  "\u83CA\u6708",
  "\u967D\u6708",
  "\u846D\u6708",
  "\u81D8\u6708"
];
var PENTAD_DATA = [
  ["\u6625\u5206", ["\u7384\u9CE5\u81F3", "\u96F7\u4E43\u767C\u8072", "\u59CB\u96FB"], ["\u767D\u7F8A\u5BAE", "A"]],
  ["\u6E05\u660E", ["\u6850\u59CB\u83EF", "\u7530\u9F20\u5316\u9D3D", "\u8679\u59CB\u898B"], ["\u767D\u7F8A\u5BAE", "A"]],
  ["\u7A40\u96E8", ["\u840D\u59CB\u751F", "\u9CF4\u9CE9\u62C2\u7FBD", "\u6234\u52DD\u964D\u65BC\u6851"], ["\u91D1\u725B\u5BAE", "B"]],
  ["\u7ACB\u590F", ["\u87BB\u87C8\u9CF4", "\u86AF\u8693\u51FA", "\u738B\u74DC\u751F"], ["\u91D1\u725B\u5BAE", "B"]],
  ["\u5C0F\u6EFF", ["\u82E6\u83DC\u79C0", "\u6249\u8349\u6B7B", "\u5C0F\u6691\u81F3"], ["\u96D9\u5B50\u5BAE", "C"]],
  ["\u8292\u7A2E", ["\u8797\u8782\u751F", "\u9D59\u59CB\u9CF4", "\u53CD\u820C\u7121\u8072"], ["\u96D9\u5B50\u5BAE", "C"]],
  ["\u590F\u81F3", ["\u9E7F\u89D2\u89E3", "\u8729\u59CB\u9CF4", "\u534A\u590F\u751F"], ["\u5DE8\u87F9\u5BAE", "D"]],
  ["\u5C0F\u6691", ["\u6EAB\u98A8\u81F3", "\u87CB\u87C0\u5C45\u58C1", "\u9DF9\u4E43\u5B78\u7FD2"], ["\u5DE8\u87F9\u5BAE", "D"]],
  ["\u5927\u6691", ["\u8150\u8349\u70BA\u87A2", "\u571F\u6F64\u6EBD\u6691", "\u5927\u96E8\u6642\u884C"], ["\u7345\u5B50\u5BAE", "E"]],
  ["\u7ACB\u79CB", ["\u6DBC\u98A8\u81F3", "\u767D\u9732\u964D", "\u5BD2\u87EC\u9CF4"], ["\u7345\u5B50\u5BAE", "E"]],
  ["\u8655\u6691", ["\u9DF9\u4E43\u796D\u9CE5", "\u5929\u5730\u59CB\u8085", "\u79BE\u4E43\u767B"], ["\u51E6\u5973\u5BAE", "F"]],
  ["\u767D\u9732", ["\u9D3B\u9D08\u4F86", "\u5143\u9CE5\u6B78", "\u7FA4\u9CE5\u990A\u7F9E"], ["\u51E6\u5973\u5BAE", "F"]],
  ["\u79CB\u5206", ["\u96F7\u4E43\u6536\u8072", "\u87C4\u87F2\u576F\u6236", "\u6C34\u59CB\u6DB8"], ["\u5929\u79E4\u5BAE", "G"]],
  ["\u5BD2\u9732", ["\u9D3B\u9D08\u4F86\u8CD3", "\u96C0\u5165\u6C34\u70BA\u86E4", "\u83CA\u6709\u9EC3\u83EF"], ["\u5929\u79E4\u5BAE", "G"]],
  ["\u971C\u964D", ["\u8C7A\u4E43\u796D\u7378", "\u8349\u6728\u9EC3\u843D", "\u87C4\u87F2\u54B8\u4FEF"], ["\u5929\u874E\u5BAE", "H"]],
  ["\u7ACB\u51AC", ["\u6C34\u59CB\u51B0", "\u5730\u59CB\u51CD", "\u96C9\u5165\u5927\u6C34\u70BA\u8703"], ["\u5929\u874E\u5BAE", "H"]],
  ["\u5C0F\u96EA", ["\u8679\u85CF\u4E0D\u898B", "\u5929\u6C23\u4E0A\u9A30\u5730\u6C23\u4E0B\u964D", "\u9589\u585E\u800C\u6210\u51AC"], ["\u4EBA\u99AC\u5BAE", "I"]],
  ["\u5927\u96EA", ["\u9DA1\u9CE5\u4E0D\u9CF4", "\u864E\u59CB\u4EA4", "\u8354\u633A\u51FA"], ["\u4EBA\u99AC\u5BAE", "I"]],
  ["\u51AC\u81F3", ["\u86AF\u8693\u7D50", "\u9E8B\u89D2\u89E3", "\u6C34\u6CC9\u52D5"], ["\u78E8\u7FAF\u5BAE", "J"]],
  ["\u5C0F\u5BD2", ["\u9D08\u5317\u9109", "\u9D72\u59D1\u5DE2", "\u96C9\u59CB\u96CA"], ["\u78E8\u7FAF\u5BAE", "J"]],
  ["\u5927\u5BD2", ["\u96DE\u59CB\u4E73", "\u9DD9\u9CE5\u53B2\u75BE", "\u6C34\u6FA4\u8179\u5805"], ["\u5B9D\u74F6\u5BAE", "K"]],
  ["\u7ACB\u6625", ["\u6771\u98A8\u89E3\u51CD", "\u87C4\u87F2\u59CB\u632F", "\u9B5A\u4E0A\u51B0"], ["\u5B9D\u74F6\u5BAE", "K"]],
  ["\u96E8\u6C34", ["\u737A\u796D\u9B5A", "\u9D3B\u9D08\u4F86", "\u8349\u6728\u840C\u52D5"], ["\u53CC\u9B5A\u5BAE", "L"]],
  ["\u9A5A\u87C4", ["\u6843\u59CB\u83EF", "\u5009\u5E9A\u9CF4", "\u9DF9\u5316\u70BA\u9CE9"], ["\u53CC\u9B5A\u5BAE", "L"]]
];
var LUNAR_PHASES = ["a", "c", "h", "f", "b", "e", "g", "d"];
var MONTH_NAMES = [
  "\u7766\u6708",
  "\u5982\u6708",
  "\u5F25\u751F",
  "\u536F\u6708",
  "\u7690\u6708",
  "\u6C34\u7121\u6708",
  "\u6587\u6708",
  "\u8449\u6708",
  "\u9577\u6708",
  "\u795E\u7121\u6708",
  "\u971C\u6708",
  "\u5E2B\u8D70"
];
var WEEKDAYS = [
  ["\u65E5\u66DC\u65E5", "Q"],
  ["\u6708\u66DC\u65E5", "R"],
  ["\u706B\u66DC\u65E5", "U"],
  ["\u6C34\u66DC\u65E5", "S"],
  ["\u6728\u66DC\u65E5", "V"],
  ["\u91D1\u66DC\u65E5", "T"],
  ["\u571F\u66DC\u65E5", "W"]
];
var DOM_ELEMENTS = {
  rendering: $(".rendering"),
  datetimeNow: $(".datetime-now"),
  year: $(".datetime-now .year"),
  month: $(".datetime-now .month"),
  day: $(".datetime-now .day"),
  cyear: $(".datetime-now .cyear"),
  cmonth: $(".datetime-now .cmonth"),
  cday: $(".datetime-now .cday"),
  youbiLogo: $(".datetime-now .youbi_logo"),
  youbi: $(".datetime-now .youbi"),
  zodiacLogo: $(".datetime-now .zodiac_logo"),
  zodiac: $(".datetime-now .zodiac"),
  lunarPhase: $(".datetime-now .lunar_phase"),
  pentad: $(".datetime-now .pentad"),
  countNine: $(".datetime-now .count_nine"),
  time: $(".datetime-now .time")
};
function calculateSolarPosition(time) {
  const epoch3 = floor(time.getTime() / 1e3);
  const n = (epoch3 - J2000_EPOCH) / SECONDS_PER_DAY;
  const L2 = 280.26 + 0.9856474 * n;
  const g = 357.528 + 0.9856003 * n;
  const lon = floor((L2 + 1.915 * sin10(g) + 0.02 * sin10(2 * g)) % 360);
  const pentadIndex = floor(lon * 72 / 360);
  const termIndex = floor(pentadIndex / 3);
  const pentadSubIndex = pentadIndex % 3;
  return { termIndex, pentadSubIndex, epoch: epoch3 };
}
function calculateLunarPhase(epoch3) {
  const n = (epoch3 - NEW_MOON_EPOCH) / SECONDS_PER_DAY;
  const age = floor(n % LUNAR_CYCLE / LUNAR_CYCLE * 7 + 0.5);
  return LUNAR_PHASES[age % LUNAR_PHASES.length];
}
function lastWinterSolstice(year, nowJDE) {
  let winterSolstice = solstice_default.december(year);
  if (nowJDE < winterSolstice) {
    winterSolstice = solstice_default.december(year - 1);
  }
  console.log(`Last winter solstice: ${winterSolstice} (${julian_default.JDEToDate(winterSolstice)})`);
  return winterSolstice;
}
function ganzhiDay(jde) {
  const jdn = Math.floor(jde + 0.5) + 49;
  const ganzhi = jdn % 60;
  return { stem: ganzhi % 10, branch: ganzhi % 12 };
}
function nextRenDay(jde) {
  const { stem } = ganzhiDay(jde);
  const offset = (8 - stem) % 10;
  console.log(`Current stem: ${stem}, next \u58EC day offset: ${offset}`);
  return jde + offset;
}
function countNine(time) {
  const jde = julian_default.DateToJDE(time);
  const winterSolstice = lastWinterSolstice(time.getFullYear(), jde);
  const nextRen = nextRenDay(winterSolstice);
  console.log(`Next \u58EC day after winter solstice: JDE ${nextRen} (${julian_default.JDEToDate(nextRen)})`);
  const beijingOffset = 8 / 24;
  const startJDN = Math.trunc(jde + 0.5 + beijingOffset);
  const endJDN = Math.trunc(nextRen + 0.5 + beijingOffset);
  console.log(`Start JDN: ${startJDN}, End JDN: ${endJDN}`);
  const daysSinceRen = startJDN - endJDN;
  console.log(`Days since \u58EC day: ${daysSinceRen}`);
  const nineCount = Math.floor(daysSinceRen / 9) + 1;
  const dayInNine = daysSinceRen % 9 + 1;
  console.log(`Current \u4E5D\u4E5D: ${nineCount} (${dayInNine} days into the current \u4E5D\u4E5D)`);
  return { nineCount, dayInNine };
}
function formatTime12h(time) {
  const hours = time.getHours();
  const period = hours >= 12 ? "\u5348\u5F8C" : "\u5348\u524D";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${period} ${String(displayHours).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:${String(time.getSeconds()).padStart(2, "0")}`;
}
function Update(time) {
  try {
    const { termIndex, pentadSubIndex, epoch: epoch3 } = calculateSolarPosition(time);
    const solarTerm = PENTAD_DATA[termIndex];
    const weekday = WEEKDAYS[time.getDay()];
    DOM_ELEMENTS.year.text(`\u5168\u65B0\u4E16\u7D00\u5143 ${1e4 + time.getFullYear()} \u5E74`);
    DOM_ELEMENTS.month.text(MONTH_NAMES[time.getMonth()]);
    DOM_ELEMENTS.day.text(`${String(time.getDate()).padStart(2, "0")} \u65E5`);
    let cal = new CalendarChinese().fromDate(time);
    DOM_ELEMENTS.cyear.text(`${STEMS[(cal.year - 1) % 10]}${BRANCHES[(cal.year - 1) % 12]}\u5E74`);
    DOM_ELEMENTS.cmonth.text(cal.leap ? "\u958F" : "" + CMONTH[cal.month - 1]);
    DOM_ELEMENTS.cday.text(`${cal.day} \u65E5`);
    DOM_ELEMENTS.youbiLogo.text(` ${weekday[1]} `);
    DOM_ELEMENTS.youbi.text(weekday[0]);
    const zodiac = solarTerm[2];
    DOM_ELEMENTS.zodiacLogo.text(` ${zodiac[1]} `);
    DOM_ELEMENTS.zodiac.text(zodiac[0]);
    const lunarPhase = calculateLunarPhase(epoch3);
    DOM_ELEMENTS.lunarPhase.text(`  ${lunarPhase}  `);
    DOM_ELEMENTS.pentad.text(`${solarTerm[0]} ${solarTerm[1][pentadSubIndex]}`);
    const { nineCount, dayInNine } = countNine(time);
    if (1 <= nineCount && nineCount <= 9) {
      const traditionalNumber = "\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D";
      DOM_ELEMENTS.countNine.text(`${traditionalNumber.charAt(nineCount - 1)}\u4E5D\u7B2C${traditionalNumber.charAt(dayInNine - 1)}\u65E5`);
    }
    DOM_ELEMENTS.time.text(formatTime12h(time));
    DOM_ELEMENTS.rendering.hide();
    DOM_ELEMENTS.datetimeNow.show();
  } catch (error) {
    console.error("Error updating datetime display:", error);
  }
}
DOM_ELEMENTS.rendering.text("Rendering...");
Update(/* @__PURE__ */ new Date());
setInterval(() => {
  Update(/* @__PURE__ */ new Date());
}, 1e3);
/*! Bundled license information:

astronomia/src/base.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module base
   *)

astronomia/src/interpolation.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module interpolation
   *)

astronomia/src/angle.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module angle
   *)

astronomia/src/sexagesimal.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module sexagesimal
   *)

astronomia/src/globe.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module globe
   *)

astronomia/src/coord.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module coord
   *)

astronomia/src/nutation.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module nutation
   *)

astronomia/src/elementequinox.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module elementequinox
   *)

astronomia/src/precess.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module precess
   *)

astronomia/src/planetposition.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module planetposition
   *)

astronomia/src/solar.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module solar
   *)

astronomia/src/apparent.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module apparent
   *)

astronomia/src/apsis.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module apsis
   *)

astronomia/src/binary.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module binary
   *)

astronomia/src/conjunction.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module conjunction
   *)

astronomia/src/circle.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module circle
   *)

astronomia/src/deltat.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module deltat
   *)

astronomia/src/iterate.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module iterate
   *)

astronomia/src/kepler.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module kepler
   *)

astronomia/src/solarxyz.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module solarxyz
   *)

astronomia/src/elliptic.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module elliptic
   *)

astronomia/src/moonphase.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moonphase
   *)

astronomia/src/eclipse.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module eclipse
   *)

astronomia/src/elp.js:
  (**
   * @copyright 2020 mdmunir
   * @copyright 2020 commenthol
   * @license MIT
   * @module elp
   *)

astronomia/src/eqtime.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module eqtime
   *)

astronomia/src/fit.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module fit
   *)

astronomia/src/illum.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module illum
   *)

astronomia/src/julian.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module julian
   *)

astronomia/src/jm.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module jm
   *)

astronomia/src/jupiter.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module jupiter
   *)

astronomia/src/planetelements.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module planetelements
   *)

astronomia/src/jupitermoons.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module jupitermoons
   *)

astronomia/src/line.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module line
   *)

astronomia/src/nearparabolic.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module nearparabolic
   *)

astronomia/src/node.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module node
   *)

astronomia/src/mars.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module mars
   *)

astronomia/src/moonposition.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moonposition
   *)

astronomia/src/moon.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moon
   *)

astronomia/src/moonillum.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moonillum
   *)

astronomia/src/moonmaxdec.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moonmaxdec
   *)

astronomia/src/moonnode.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module moonnode
   *)

astronomia/src/parabolic.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module parabolic
   *)

astronomia/src/sidereal.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module sidereal
   *)

astronomia/src/parallax.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module parallax
   *)

astronomia/src/parallactic.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module parallactic
   *)

astronomia/src/perihelion.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module perihelion
   *)

astronomia/src/planetary.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module planetary
   *)

astronomia/src/pluto.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module pluto
   *)

astronomia/src/refraction.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module refraction
   *)

astronomia/src/rise.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module rise
   *)

astronomia/src/saturnmoons.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module saturnmoons
   *)

astronomia/src/saturnring.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module saturnring
   *)

astronomia/src/solardisk.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module solardisk
   *)

astronomia/src/solstice.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module solstice
   *)

astronomia/src/stellar.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module stellar
   *)

astronomia/src/sundial.js:
  (**
   * @copyright 2013 Sonia Keys
   * @copyright 2016 commenthol
   * @license MIT
   * @module sundial
   *)

astronomia/src/sunrise.js:
  (**
   * @copyright 2016 commenthol
   * @license MIT
   * @module sunrise
   *)

date-chinese/src/Chinese.js:
date-chinese/src/Korean.js:
date-chinese/src/Vietnamese.js:
date-chinese/src/Japanese.js:
date-chinese/src/index.js:
  (**
   * @copyright 2016 commenthol
   * @license MIT
   *)
*/
//# sourceMappingURL=Datetime.js.map
