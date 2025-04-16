import { Location, Prisma } from "@prisma/client";
import { LocationRepository } from "./location.repository";
import AppError from "@/shared/errors/AppError";

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async createLocation(data: Prisma.LocationCreateInput): Promise<Location> {
    return this.locationRepository.create(data);
  }

  async getLocationById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new AppError(404, "Location not found");
    return location;
  }

  async getLocations(params: {
    page: number;
    limit: number;
  }): Promise<{ locations: Location[]; total: number }> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [locations, total] = await Promise.all([
      this.locationRepository.findMany({
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.locationRepository.count(),
    ]);

    return { locations, total };
  }

  async updateLocation(
    id: string,
    data: Prisma.LocationUpdateInput
  ): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new AppError(404, "Location not found");
    return this.locationRepository.update(id, data);
  }

  async deleteLocation(id: string): Promise<void> {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new AppError(404, "Location not found");
    await this.locationRepository.delete(id);
  }
}
