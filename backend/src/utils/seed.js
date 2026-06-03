import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Vessel from '../models/Vessel.js';
import Voyage from '../models/Voyage.js';
import COSPReport from '../models/COSPReport.js';
import NoonReport from '../models/NoonReport.js';
import EOSPReport from '../models/EOSPReport.js';
import Alert from '../models/Alert.js';
import RouteOptimization from '../models/RouteOptimization.js';
import ArrivalReport from '../models/ArrivalReport.js';
import DepartureReport from '../models/DepartureReport.js';
import PortNoonReport from '../models/PortNoonReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vessel_optimization';

async function seed() {
  try {
    console.log('Connecting to database:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully for seeding.');

    // 1. Drop existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Vessel.deleteMany({});
    await Voyage.deleteMany({});
    await COSPReport.deleteMany({});
    await NoonReport.deleteMany({});
    await EOSPReport.deleteMany({});
    await Alert.deleteMany({});
    await RouteOptimization.deleteMany({});
    await ArrivalReport.deleteMany({});
    await DepartureReport.deleteMany({});
    await PortNoonReport.deleteMany({});

    // 2. Hash passwords
    console.log('Hashing passwords...');
    const adminPasswordHashed = await bcrypt.hash('admin123', 10);
    const operatorPasswordHashed = await bcrypt.hash('password123', 10);

    // 3. Seed Users
    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@vesselopt.com',
      password: adminPasswordHashed,
      role: 'Admin',
      company: 'VesselOpt Admin Panel'
    });

    const operatorUser = await User.create({
      name: 'Capt. Alex Mercer',
      email: 'operator@oceanic-shipping.com',
      password: operatorPasswordHashed,
      role: 'Operator',
      company: 'Oceanic Blue Shipping'
    });

    // 4. Seed Vessels
    console.log('Seeding Vessels...');
    const vessels = await Vessel.create([
      {
        name: 'M/T DE XI',
        imo: '9361736',
        type: 'Tanker',
        dwt: '105,321',
        status: 'At Sea',
        lat: '02°15\'N',
        lon: '103°50\'E',
        fuelRob: 926,
        speedScore: 92,
        fuelScore: 88,
        weatherScore: 95,
        overallScore: 91,
        owner: 'Apex Tankers Ltd.',
        manager: 'Veson ShipManagement',
        capacity: '115,000 cbm',
        grossTonnage: '56,000',
        builtYear: '2018',
        flag: 'Singapore'
      },
      {
        name: 'M/V Oceanic',
        imo: '9245671',
        type: 'Bulker',
        dwt: '82,000',
        status: 'At Sea',
        lat: '12°35\'N',
        lon: '074°12\'E',
        fuelRob: 654,
        speedScore: 89,
        fuelScore: 91,
        weatherScore: 88,
        overallScore: 89,
        owner: 'Oceanic Carriers',
        manager: 'Synergy Marine Group',
        capacity: '92,000 cbm',
        grossTonnage: '44,000',
        builtYear: '2020',
        flag: 'Panama'
      },
      {
        name: 'M/T Atlantic Star',
        imo: '9116043',
        type: 'Tanker',
        dwt: '115,000',
        status: 'In Port',
        lat: '51°55\'N',
        lon: '004°24\'E',
        fuelRob: 250,
        speedScore: 71,
        fuelScore: 68,
        weatherScore: 75,
        overallScore: 71,
        owner: 'Star Shipping Corp',
        manager: 'V Ships Ltd.',
        capacity: '125,000 cbm',
        grossTonnage: '62,000',
        builtYear: '2015',
        flag: 'Marshall Islands'
      },
      {
        name: 'M/V Pacific Dawn',
        imo: '9234516',
        type: 'Container',
        dwt: '68,500',
        status: 'At Sea',
        lat: '34°22\'N',
        lon: '139°45\'E',
        fuelRob: 1205,
        speedScore: 95,
        fuelScore: 94,
        weatherScore: 96,
        overallScore: 95,
        owner: 'TransPacific Shipping',
        manager: 'Anglo-Eastern Group',
        capacity: '80,000 cbm',
        grossTonnage: '52,000',
        builtYear: '2021',
        flag: 'Liberia'
      },
      {
        name: 'M/V Global Trust',
        imo: '9187652',
        type: 'Bulker',
        dwt: '48,300',
        status: 'Anchored',
        lat: '22°18\'N',
        lon: '114°10\'E',
        fuelRob: 310,
        speedScore: 85,
        fuelScore: 87,
        weatherScore: 83,
        overallScore: 85,
        owner: 'Global Bulkers S.A.',
        manager: 'Fleet Management Ltd',
        capacity: '52,000 cbm',
        grossTonnage: '28,000',
        builtYear: '2012',
        flag: 'Hong Kong'
      }
    ]);

    const mtDeXi = vessels[0];
    const mvOceanic = vessels[1];

    // 5. Seed Voyages
    console.log('Seeding Voyages...');
    const voyages = await Voyage.create([
      {
        voyageNumber: 'VYG-2024-015',
        vesselId: mtDeXi._id,
        vesselName: mtDeXi.name,
        departurePort: 'Singapore (SGP)',
        destinationPort: 'Rotterdam (RTM)',
        cpSpeed: 12.5,
        cpConsumption: 25.0,
        departureDate: '2026-05-01',
        eta: '2026-05-16',
        status: 'Active',
        distanceTotal: 8350,
        distanceSailed: 1271,
        fuelPrice: 650,
        charterRate: 18000,
        // Gaps Coverage
        draftForward: 12.0,
        draftMid: 12.2,
        draftAft: 12.4,
        displacement: 85000,
        constant: 250,
        cargoDescription: 'Crude Oil (Brent Crude)',
        cargoQuantity: 80000,
        billOfLadingQuantity: 80200,
        cargoRemarks: 'Laden voyage via Suez Canal',
        goodWeatherDays: 2.5,
        speedDeficit: 0.8,
        fuelOverconsumptionCost: 12000
      },
      {
        voyageNumber: 'VYG-2024-014',
        vesselId: mvOceanic._id,
        vesselName: mvOceanic.name,
        departurePort: 'Shanghai (PVG)',
        destinationPort: 'Los Angeles (LAX)',
        cpSpeed: 13.0,
        cpConsumption: 28.0,
        departureDate: '2026-04-10',
        eta: '2026-04-25',
        status: 'Completed',
        distanceTotal: 5700,
        distanceSailed: 5700,
        fuelPrice: 620,
        charterRate: 20000,
        // Gaps Coverage
        draftForward: 10.5,
        draftMid: 10.8,
        draftAft: 11.0,
        displacement: 62000,
        constant: 180,
        cargoDescription: 'Iron Ore',
        cargoQuantity: 58000,
        billOfLadingQuantity: 58150,
        cargoRemarks: 'Full cargo load',
        goodWeatherDays: 12.0,
        speedDeficit: 0.2,
        fuelOverconsumptionCost: 0
      }
    ]);

    const activeVoyage = voyages[0];

    // 6. Seed COSP Reports
    console.log('Seeding COSP reports...');
    await COSPReport.create({
      voyageId: activeVoyage._id,
      date: '2026-05-01 08:00',
      position: 'Singapore Pilot Station',
      draft: '12.4m',
      robFuel: 1288,
      eta: '2026-05-16',
      // Gaps Coverage
      draftForward: 12.0,
      draftMid: 12.2,
      draftAft: 12.4,
      displacement: 85000,
      constant: 250,
      cargoDescription: 'Crude Oil (Brent Crude)',
      cargoQuantity: 80000,
      billOfLadingQuantity: 80200,
      cargoRemarks: 'Laden voyage via Suez Canal'
    });

    // 7. Seed Noon Reports
    console.log('Seeding Noon reports...');
    await NoonReport.create([
      {
        voyageId: activeVoyage._id,
        date: '2026-05-02 12:00',
        latitude: '02°15\'N',
        longitude: '103°50\'E',
        distanceSailed: 456,
        speed: 11.3,
        rpm: 78,
        slip: 5.2,
        windSpeed: 16,
        windDir: '210',
        windDirection: 'SSW',
        currentSpeed: 1.2,
        currentDir: '195',
        currentDirection: 'SSW',
        swellDirection: 'S',
        beaufortScale: 4,
        waveHeight: 1.2,
        fuelConsumed: 38.2,
        robFuel: 1250,
        // Gaps Coverage
        draftForward: 12.0,
        draftMid: 12.2,
        draftAft: 12.4,
        displacement: 85000,
        constant: 250,
        meCylinderOilRob: 45,
        cylinderOilConsumption: 1.2,
        meSystemOilRob: 32,
        meSystemOilConsumption: 0.8,
        aeLoRob: 15,
        aeLoConsumption: 0.3,
        fwGenerated: 15,
        fwConsumed: 12,
        fwReceived: 0,
        fwRob: 180,
        ae1Hours: 24,
        ae2Hours: 24,
        ae3Hours: 0,
        meHsfoConsumed: 22.0,
        meLsfoConsumed: 5.5,
        meMgoConsumed: 1.2,
        aeHsfoConsumed: 2.1,
        aeLsfoConsumed: 1.0,
        aeMgoConsumed: 0.5,
        boilerHsfoConsumed: 1.5,
        boilerLsfoConsumed: 0.8,
        boilerMgoConsumed: 0.2,
        robHsfo: 800,
        robLsfo: 120,
        robMgo: 30,
        // Position Report Template Gaps
        utcTime: '12:00',
        vesselCondition: 'Laden',
        lastPort: 'Singapore (SGP)',
        nextPort: 'Rotterdam (RTM)',
        distanceToNextPort: 7894,
        engineDistance: 460,
        distanceSailedFromCosp: 456,
        steamingTimeDaily: 24,
        steamingTimeAfterCosp: 24,
        allowedCpSpeed: 12.5,
        averageSpeed: 11.3,
        eta: '2026-05-16',
        fuelReceived: 0,
        remarks: 'Sailing under good weather, minor adverse currents.'
      },
      {
        voyageId: activeVoyage._id,
        date: '2026-05-03 12:00',
        latitude: '05°53\'N',
        longitude: '095°18\'E',
        distanceSailed: 410,
        speed: 11.1,
        rpm: 76,
        slip: 6.1,
        windSpeed: 12,
        windDir: '220',
        windDirection: 'SW',
        currentSpeed: 1.0,
        currentDir: '190',
        currentDirection: 'S',
        swellDirection: 'SW',
        beaufortScale: 3,
        waveHeight: 0.8,
        fuelConsumed: 37.5,
        robFuel: 1212,
        // Gaps Coverage
        draftForward: 12.0,
        draftMid: 12.2,
        draftAft: 12.4,
        displacement: 85000,
        constant: 250,
        meCylinderOilRob: 43.8,
        cylinderOilConsumption: 1.2,
        meSystemOilRob: 31.2,
        meSystemOilConsumption: 0.8,
        aeLoRob: 14.7,
        aeLoConsumption: 0.3,
        fwGenerated: 16,
        fwConsumed: 11,
        fwReceived: 0,
        fwRob: 185,
        ae1Hours: 24,
        ae2Hours: 24,
        ae3Hours: 0,
        meHsfoConsumed: 21.5,
        meLsfoConsumed: 5.3,
        meMgoConsumed: 1.1,
        aeHsfoConsumed: 2.0,
        aeLsfoConsumed: 0.9,
        aeMgoConsumed: 0.5,
        boilerHsfoConsumed: 1.4,
        boilerLsfoConsumed: 0.8,
        boilerMgoConsumed: 0.2,
        robHsfo: 778,
        robLsfo: 115,
        robMgo: 29,
        // Position Report Template Gaps
        utcTime: '12:00',
        vesselCondition: 'Laden',
        lastPort: 'Singapore (SGP)',
        nextPort: 'Rotterdam (RTM)',
        distanceToNextPort: 7484,
        engineDistance: 420,
        distanceSailedFromCosp: 866,
        steamingTimeDaily: 24,
        steamingTimeAfterCosp: 48,
        allowedCpSpeed: 12.5,
        averageSpeed: 11.2,
        eta: '2026-05-16',
        fuelReceived: 0,
        remarks: 'Calm seas, consistent engine performance.'
      },
      {
        voyageId: activeVoyage._id,
        date: '2026-05-04 12:00',
        latitude: '06°30\'N',
        longitude: '080°07\'E',
        distanceSailed: 405,
        speed: 11.5,
        rpm: 77,
        slip: 4.8,
        windSpeed: 15,
        windDir: '215',
        windDirection: 'SW',
        currentSpeed: 1.1,
        currentDir: '185',
        currentDirection: 'S',
        swellDirection: 'SSW',
        beaufortScale: 4,
        waveHeight: 1,
        fuelConsumed: 36.8,
        robFuel: 1175,
        // Gaps Coverage
        draftForward: 12.0,
        draftMid: 12.2,
        draftAft: 12.4,
        displacement: 85000,
        constant: 250,
        meCylinderOilRob: 42.6,
        cylinderOilConsumption: 1.2,
        meSystemOilRob: 30.4,
        meSystemOilConsumption: 0.8,
        aeLoRob: 14.4,
        aeLoConsumption: 0.3,
        fwGenerated: 15,
        fwConsumed: 12,
        fwReceived: 0,
        fwRob: 188,
        ae1Hours: 24,
        ae2Hours: 24,
        ae3Hours: 0,
        meHsfoConsumed: 21.0,
        meLsfoConsumed: 5.2,
        meMgoConsumed: 1.1,
        aeHsfoConsumed: 2.0,
        aeLsfoConsumed: 0.9,
        aeMgoConsumed: 0.5,
        boilerHsfoConsumed: 1.4,
        boilerLsfoConsumed: 0.7,
        boilerMgoConsumed: 0.2,
        robHsfo: 757,
        robLsfo: 109,
        robMgo: 28,
        // Position Report Template Gaps
        utcTime: '12:00',
        vesselCondition: 'Laden',
        lastPort: 'Singapore (SGP)',
        nextPort: 'Rotterdam (RTM)',
        distanceToNextPort: 7079,
        engineDistance: 415,
        distanceSailedFromCosp: 1271,
        steamingTimeDaily: 24,
        steamingTimeAfterCosp: 72,
        allowedCpSpeed: 12.5,
        averageSpeed: 11.3,
        eta: '2026-05-16',
        fuelReceived: 0,
        remarks: 'Maintained steady passage tracking, weather remains favorable.'
      }
    ]);

    // 8. Seed Alert warnings
    console.log('Seeding Alerts...');
    await Alert.create([
      {
        type: 'Speed Performance Alerts',
        voyageNumber: activeVoyage.voyageNumber,
        vessel: activeVoyage.vesselName,
        voyageId: activeVoyage._id,
        vesselId: activeVoyage.vesselId,
        issue: '2.0 kt in calm weather',
        estLoss: 15200,
        status: 'Open',
        severity: 'Medium',
        time: '03 May 13:10'
      },
      {
        type: 'Weather Alerts',
        voyageNumber: activeVoyage.voyageNumber,
        vessel: activeVoyage.vesselName,
        voyageId: activeVoyage._id,
        vesselId: activeVoyage.vesselId,
        issue: 'North Atlantic: wave height may exceed 4.5m in next 24 hrs.',
        estLoss: 10450,
        status: 'Open',
        severity: 'High',
        time: '03 May 10:30'
      },
      {
        type: 'Fuel Alerts',
        voyageNumber: activeVoyage.voyageNumber,
        vessel: activeVoyage.vesselName,
        voyageId: activeVoyage._id,
        vesselId: activeVoyage.vesselId,
        issue: 'M/T DE XI consumed 8.4 MT more than allowed in calm weather.',
        estLoss: 6800,
        status: 'Open',
        severity: 'Medium',
        time: '02 May 15:20'
      },
      {
        type: 'Claim Alerts',
        voyageNumber: activeVoyage.voyageNumber,
        vessel: activeVoyage.vesselName,
        voyageId: activeVoyage._id,
        vesselId: activeVoyage.vesselId,
        issue: 'Claim risk: Speed deficit exceeded 0.5 knots.',
        estLoss: 12000,
        status: 'Open',
        severity: 'High',
        time: '03 May 12:00'
      }
    ]);

    // 9. Seed Route Optimizations
    console.log('Seeding Route Optimizations...');
    await RouteOptimization.create([
      {
        voyageId: activeVoyage._id,
        routeA: 'Great Circle Route',
        routeB: 'Weather Routing Optimized',
        distanceA: 8350,
        distanceB: 8230,
        distanceComparison: -120,
        fuelA: 410,
        fuelB: 395.5,
        fuelComparison: -14.5,
        etaA: '2026-05-16 18:00',
        etaB: '2026-05-16 05:30',
        etaComparison: -12.5,
        recommendationReason: 'Optimized to avoid storm center in North Pacific. Recommended Route B.'
      }
    ]);

    // 10. Seed Port Noon, Arrival, and Departure Reports
    console.log('Seeding Port Noon, Arrival, and Departure Reports...');
    await PortNoonReport.create({
      voyageId: activeVoyage._id,
      date: '2026-05-04 12:00',
      utcTime: '12:00',
      portName: 'Rotterdam (RTM)',
      vesselCondition: 'Laden',
      draftForward: 12.0,
      draftMid: 12.2,
      draftAft: 12.4,
      displacement: 85000,
      constant: 250,
      fuelConsumed: 4.8,
      fuelReceived: 0,
      robHsfo: 752.2,
      robLsfo: 108.3,
      robMgo: 27.5,
      robFuel: 888.0,
      meCylinderOilRob: 42.0,
      meSystemOilRob: 30.0,
      aeLoRob: 14.0,
      fwRob: 185,
      ae1Hours: 24,
      ae2Hours: 24,
      ae3Hours: 0,
      remarks: 'Port cargo discharging operations.'
    });

    await ArrivalReport.create({
      voyageId: activeVoyage._id,
      date: '2026-05-04 06:00',
      utcTime: '06:00',
      portName: 'Rotterdam (RTM)',
      arrivalPlace: 'Berth 4',
      draftForward: 12.0,
      draftMid: 12.2,
      draftAft: 12.4,
      displacement: 85000,
      constant: 250,
      cargoDescription: 'Crude Oil',
      cargoQuantity: 80000,
      billOfLadingQuantity: 80200,
      cargoRemarks: 'Arrived safe at berth',
      robHsfo: 752.2,
      robLsfo: 108.3,
      robMgo: 27.5,
      robFuel: 888.0,
      meCylinderOilRob: 42.0,
      meSystemOilRob: 30.0,
      aeLoRob: 14.0,
      fwRob: 185,
      ae1Hours: 72,
      ae2Hours: 72,
      ae3Hours: 0,
      remarks: 'FWE completed'
    });

    await DepartureReport.create({
      voyageId: activeVoyage._id,
      date: '2026-05-01 07:00',
      utcTime: '07:00',
      portName: 'Singapore (SGP)',
      departurePlace: 'Berth 1',
      draftForward: 12.0,
      draftMid: 12.2,
      draftAft: 12.4,
      displacement: 85000,
      constant: 250,
      cargoDescription: 'Crude Oil',
      cargoQuantity: 80000,
      billOfLadingQuantity: 80200,
      cargoRemarks: 'Departure standard lading',
      robHsfo: 800,
      robLsfo: 120,
      robMgo: 30,
      robFuel: 950,
      meCylinderOilRob: 45,
      meSystemOilRob: 32,
      aeLoRob: 15,
      fwRob: 180,
      ae1Hours: 0,
      ae2Hours: 24,
      ae3Hours: 24,
      nextPort: 'Rotterdam (RTM)',
      allowedCpSpeed: 12.5,
      remarks: 'Departure harbor passage open'
    });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed execution error:', error);
    process.exit(1);
  }
}

seed();
