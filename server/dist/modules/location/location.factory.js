"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLocationController = void 0;
const location_controller_1 = require("./location.controller");
const location_repository_1 = require("./location.repository");
const location_service_1 = require("./location.service");
const makeLocationController = () => {
    const locationRepository = new location_repository_1.LocationRepository();
    const locationService = new location_service_1.LocationService(locationRepository);
    const locationController = new location_controller_1.LocationController(locationService);
    return locationController;
};
exports.makeLocationController = makeLocationController;
