/// <reference types="node" />

import { EventEmitter } from 'events';
import { Socket } from 'net'
import * as Stream from 'stream'
import { Agent } from 'http'

type PromiseLike = Promise<void> | void

declare module 'minecraft-protocol' {
	export class Client extends EventEmitter {
		constructor(isServer: boolean, version: string, customPackets?: any)
		state: States
		isServer: boolean
		socket: Socket
		uuid: string
		username: string
		session?: any
		profile?: any
		latency: number
		customPackets: any
		protocolVersion: number
		version: string
		write(name: string, params: any): void
		writeRaw(buffer: any): void
		compressionThreshold: string
		ended: boolean
		connect(port: number, host: string): void
		setSocket(socket: Socket): void
		end(reason?: string): void
		registerChannel(name: string, typeDefinition: any, custom?: boolean): void
		unregisterChannel(name: string): void
		writeChannel(channel: any, params: any): void
		on(event: 'packet', handler: (data: any, packetMeta: PacketMeta, buffer: Buffer, fullBuffer: Buffer) => void): this
		on(event: 'raw', handler: (buffer: Buffer, packetMeta: PacketMeta) => void): this
		on(event: 'connect', handler: () => unknown): this
		on(event: 'end', handler: (reason: string) => void): this
		on(event: 'session', handler: (session: any) => void): this
		on(event: 'state', handler: (newState: States, oldState: States) => void): this
		on(event: 'error', listener: (error: Error) => void): this
		on(event: string, handler: (data: any, packetMeta: PacketMeta) => unknown): this
		on(event: `raw.${string}`, handler: (buffer: Buffer, packetMeta: PacketMeta) => unknown): this
		on(event: 'error', listener: (error: Error) => PromiseLike): this
		on(event: 'packet', handler: (data: any, packetMeta: PacketMeta, buffer: Buffer, fullBuffer: Buffer) => PromiseLike): this
		on(event: 'raw', handler: (buffer: Buffer, packetMeta: PacketMeta) => PromiseLike): this
		on(event: 'session', handler: (session: any) => PromiseLike): this
		on(event: 'state', handler: (newState: States, oldState: States) => PromiseLike): this
		on(event: 'end', handler: (reason: string) => PromiseLike): this
		on(event: 'connect', handler: () => PromiseLike): this
		on(event: string, handler: (data: any, packetMeta: PacketMeta) => PromiseLike): this
		on(event: `raw.${string}`, handler: (buffer: Buffer, packetMeta: PacketMeta) => PromiseLike): this
	}

	export interface ClientOptions {
		username: string
		port?: number
		auth?: 'mojang' | 'microsoft'
		password?: string
		host?: string
		clientToken?: string
		accessToken?: string
		authServer?: string
		sessionServer?: string
		keepAlive?: boolean
		closeTimeout?: number 
		noPongTimeout?: number
		checkTimeoutInterval?: number
		version?: string
		customPackets?: any
		hideErrors?: boolean
		skipValidation?: boolean
		stream?: Stream
		connect?: (client: Client) => void
		agent?: Agent
		fakeHost?: string
		profilesFolder?: string
		onMsaCode?: (data: MicrosoftDeviceAuthorizationResponse) => void
		id?: number

	}

	export class Server extends EventEmitter {
		constructor(version: string, customPackets?: any)
		writeToClients(clients: Client[], name: string, params: any): void
		onlineModeExceptions: object
		clients: ClientsMap
		playerCount: number
		maxPlayers: number
		motd: string
		favicon: string
		close(): void
		on(event: 'connection', handler: (client: ServerClient) => PromiseLike): this
		on(event: 'error', listener: (error: Error) => PromiseLike): this
		on(event: 'login', handler: (client: ServerClient) => PromiseLike): this
		on(event: 'listening', listener: () => PromiseLike): this
		once(event: 'connection', handler: (client: ServerClient) => PromiseLike): this
		once(event: 'error', listener: (error: Error) => PromiseLike): this
		once(event: 'login', handler: (client: ServerClient) => PromiseLike): this
		once(event: 'listening', listener: () => PromiseLike): this
	}

	export interface ServerClient extends Client {
		id: number
	}

	export interface ServerOptions {
		port?: number
		host?: string
		kickTimeout?: number
		checkTimeoutInterval?: number
		'online-mode'?: boolean
		beforePing?: (response: any, client: Client, callback?: (result: any) => any) => any
		beforeLogin?: (client: Client) => void
		motd?: string
		maxPlayers?: number
		keepAlive?: boolean
		version?: string
		customPackets?: any
		errorHandler?: (client: Client, error: Error) => void
		hideErrors?: boolean
		agent?: Agent
	}

	export interface SerializerOptions {
		customPackets: any
		isServer?: boolean
		state?: States
		version: string
	}
	
	export interface MicrosoftDeviceAuthorizationResponse {
		device_code: string
		user_code: string
		verification_uri: string
		expires_in: number
		interval: number
		message: string
	}

	enum States {
		HANDSHAKING = 'handshaking',
		LOGIN = 'login',
		PLAY = 'play',
		STATUS = 'status',
	}

	export interface PacketMeta {
		name: string
		state: States
	}

	interface ClientsMap {
		[key: number]: Client
	}

	export interface PingOptions {
		host?: string
		majorVersion?: string
		port?: number
		protocolVersion?: string
		version?: string
	}

	export interface OldPingResult {
		maxPlayers: number,
		motd: string
		playerCount: number
		prefix: string
		protocol: string
		version: string
	}

	export interface NewPingResult {
		description: string
		players: {
			max: number
			online: number
			sample: {
				id: string
				name: string
			}[]
		}
		version: {
			name: string
			protocol: string
		}
		favicon: string
		latency: number
	}

	export const states: typeof States
	export const supportedVersions: ['1.7', '1.8', '1.9', '1.10', '1.11.2', '1.12.2', '1.13.2', '1.14.4', '1.15.2', '1.16.5', '1.17.1']

	export function createServer(options: ServerOptions): Server
	export function createClient(options: ClientOptions): Client

	// TODO: Create typings on protodef to define here
	export function createSerializer({ state, isServer, version, customPackets }: SerializerOptions): any
	export function createDeserializer({ state, isServer, version, customPackets }: SerializerOptions): any

	export function ping(options: PingOptions, callback: (error: Error, result: OldPingResult | NewPingResult) => void): void
}