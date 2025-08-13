import { LocationController } from "./location.controller";
import { LocationRepository } from "./location.repository";
import { LocationService } from "./location.service";

export const makeLocationController = () => {
  const locationRepository = new LocationRepository();
  const locationService = new LocationService(locationRepository);
  const locationController = new LocationController(locationService);

  return locationController;
};
