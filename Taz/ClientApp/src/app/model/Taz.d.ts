//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.

declare module Microsoft.AspNetCore.Identity {
	export interface IIdentityUser
	{
		id?: string;
		userName?: string;
		normalizedUserName?: string;
		email?: string;
		normalizedEmail?: string;
		emailConfirmed?: boolean;
		passwordHash?: string;
		securityStamp?: string;
		concurrencyStamp?: string;
		phoneNumber?: string;
		phoneNumberConfirmed?: boolean;
		twoFactorEnabled?: boolean;
		lockoutEnd?: string;
		lockoutEnabled?: boolean;
		accessFailedCount?: number;
	}
	export interface IIdentityUser
	{
	}
}
declare module Taz.Model.Domain {
	export interface ITazUser extends Microsoft.AspNetCore.Identity.IIdentityUser
	{
		isActivated?: boolean;
		isSuspended?: boolean;
		isDisabled?: boolean;
		firstName?: string;
		lastName?: string;
		facebookId?: number;
		pictureUrl?: string;
	}
	export interface IEntity
	{
		id?: number;
	}
	export interface ITazCustomer extends Taz.Model.Domain.IEntity
	{
		identityId?: string;
		identity?: Taz.Model.Domain.ITazUser;
		location?: string;
		locale?: string;
		gender?: string;
	}
	export interface IFakeEntity extends Taz.Model.Domain.IEntity
	{
		name?: string;
		rootId?: number;
		parentId?: number;
		parent?: Taz.Model.Domain.IFakeEntity;
		root?: Taz.Model.Domain.IFakeEntity;
		children?: Taz.Model.Domain.IFakeEntity[];
		rootCollection?: Taz.Model.Domain.IFakeEntity[];
	}
}
declare module Taz.Model.View {
	export interface IStringResponse
	{
		data?: string;
	}
}
declare module Taz.Model.Security {
	export interface IPolicyMap
	{
		policyName?: string;
		policyType?: Taz.Model.Security.PolicyTypeEnum;
		roles?: string[];
	}
	export interface IAuthenticationTokenResponse
	{
		accessToken?: string;
	}
	export interface IJwtToken
	{
		aud?: string;
		exp?: number;
		iat?: number;
		id?: string;
		iss?: string;
		jti?: string;
		nbf?: number;
		rol?: string | string[];
		sub?: string;
	}
	export const enum PolicyTypeEnum { 
		AuthenticatedUser = 0, 
		Administrator = 1, 
	}
}
declare module Taz.Model.View.Account {
	export interface IRegistration
	{
		email?: string;
		password?: string;
		firstName?: string;
		lastName?: string;
		location?: string;
	}
	export interface ICredentials
	{
		userName?: string;
		password?: string;
	}
}
