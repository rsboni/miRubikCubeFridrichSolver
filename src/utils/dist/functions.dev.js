"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTouchPositions = exports.getCubePositionDiffrence = exports.calculateResultantAngle = exports.calcPosition = exports.toDegrees = exports.toRadians = void 0;

var toRadians = function toRadians(angle) {
  return angle * (Math.PI / 180);
};

exports.toRadians = toRadians;

var toDegrees = function toDegrees(angle) {
  return angle * (180 / Math.PI);
}; // **Return is new position based on current position and resultant roation */


exports.toDegrees = toDegrees;

var calcPosition = function calcPosition(position, roationVector, angleOfRotation) {
  var cos = function cos(angle) {
    return Math.cos(toRadians(angle));
  };

  var sin = function sin(angle) {
    return Math.sin(toRadians(angle));
  };

  var ux = roationVector[0];
  var uy = roationVector[1];
  var uz = roationVector[2];
  var angle = angleOfRotation;
  var x = position[0] * (cos(angle) + ux * ux * (1 - cos(angle))) + position[1] * (ux * uy * (1 - cos(angle)) - uz * sin(angle)) + position[2] * (ux * uz * (1 - cos(angle)) + uy * sin(angle));
  var y = position[0] * (uy * ux * (1 - cos(angle)) + uz * sin(angle)) + position[1] * (cos(angle) + uy * uy * (1 - cos(angle))) + position[2] * (uy * uz * (1 - cos(angle)) - ux * sin(angle));
  var z = position[0] * (uz * ux * (1 - cos(angle)) - uy * sin(angle)) + position[1] * (uz * uy * (1 - cos(angle)) + ux * sin(angle)) + position[2] * (cos(angle) + uz * uz * (1 - cos(angle)));
  return [x, y, z];
};
/** Return is new angle of rotatio and rotation vecctor */


exports.calcPosition = calcPosition;

var calculateResultantAngle = function calculateResultantAngle(alpha, roationVector, currentRotationVector, beta) {
  var cos = function cos(angle) {
    return Math.cos(toRadians(angle));
  };

  var sin = function sin(angle) {
    return Math.sin(toRadians(angle));
  };

  var lx = roationVector[0];
  var ly = roationVector[1];
  var lz = roationVector[2];
  var mx = currentRotationVector[0];
  var my = currentRotationVector[1];
  var mz = currentRotationVector[2];
  var gamaInverse = cos(alpha / 2) * cos(beta / 2) - sin(alpha / 2) * sin(beta / 2) * (lx * mx + ly * my + lz * mz);
  var gama = 2 * toDegrees(Math.acos(Math.abs(gamaInverse) > 1 ? gamaInverse / Math.abs(gamaInverse) : gamaInverse));
  var nx = (sin(alpha / 2) * cos(beta / 2) * lx + cos(alpha / 2) * sin(beta / 2) * mx + sin(alpha / 2) * sin(beta / 2) * (ly * mz - lz * my)) / sin(gama / 2);
  var ny = (sin(alpha / 2) * cos(beta / 2) * ly + cos(alpha / 2) * sin(beta / 2) * my + sin(alpha / 2) * sin(beta / 2) * (lz * mx - lx * mz)) / sin(gama / 2);
  var nz = (sin(alpha / 2) * cos(beta / 2) * lz + cos(alpha / 2) * sin(beta / 2) * mz + sin(alpha / 2) * sin(beta / 2) * (lx * my - ly * mx)) / sin(gama / 2);
  return {
    gama: gama,
    rotationVector: [isNaN(nx) || !isFinite(nx) ? 1 : nx, isNaN(ny) || !isFinite(nx) ? 1 : ny, isNaN(nz) || !isFinite(nx) ? 1 : nz]
  };
};

exports.calculateResultantAngle = calculateResultantAngle;

var getCubePositionDiffrence = function getCubePositionDiffrence(movedPosition, currentPosition, xMove, yMove) {
  var xDiff = currentPosition[0] + xMove - movedPosition[0];
  var yDiff = currentPosition[1] + yMove - movedPosition[1];
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

exports.getCubePositionDiffrence = getCubePositionDiffrence;

var getTouchPositions = function getTouchPositions(eve) {
  if (eve.targetTouches) {
    return {
      clientX: eve.targetTouches[0].clientX,
      clientY: eve.targetTouches[0].clientY
    };
  } else {
    return {
      clientX: eve.clientX,
      clientY: eve.clientY
    };
  }
};

exports.getTouchPositions = getTouchPositions;