export interface ApplicationIds {
    application_id: string;
}

export interface EndDeviceIds {
    device_id: string;
    application_ids: ApplicationIds;
    dev_eui: string;
    join_eui: string;
    dev_addr: string;
}

export interface DecodedPayload {
    analog_in_1: number;
    relative_humidity_1: number;
    temperature_1: number;
}

export interface GatewayIds {
    gateway_id: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    altitude: number;
    source: string;
}

export interface RxMetadata {
    gateway_ids: GatewayIds;
    time: Date;
    timestamp: number;
    rssi: number;
    channel_rssi: number;
    snr: number;
    location: Location;
    uplink_token: string;
}

export interface Lora {
    bandwidth: number;
    spreading_factor: number;
}

export interface DataRate {
    lora: Lora;
}

export interface Settings {
    data_rate: DataRate;
    coding_rate: string;
    frequency: string;
    timestamp: number;
}

export interface VersionIds {
    brand_id: string;
    model_id: string;
    hardware_version: string;
    firmware_version: string;
    band_id: string;
}

export interface NetworkIds {
    net_id: string;
    tenant_id: string;
    cluster_id: string;
}

export interface UplinkMessage {
    session_key_id: string;
    f_port: number;
    f_cnt: number;
    frm_payload: string;
    decoded_payload: DecodedPayload;
    rx_metadata: RxMetadata[];
    settings: Settings;
    received_at: string;
    confirmed: boolean;
    consumed_airtime: string;
    version_ids: VersionIds;
    network_ids: NetworkIds;
}

export interface TheThingsNetWebhookBody {
    end_device_ids: EndDeviceIds;
    correlation_ids: string[];
    received_at: string;
    uplink_message: UplinkMessage;
}
