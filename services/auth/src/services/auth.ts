import jwt from 'jsonwebtoken';
import {Credentials} from '../schema/credentials';
import {JsonWebToken} from '../schema/jwt';

export const signInWithCredentials = async (credentials: Credentials) => null;
export const registerWithCredentials = async (credentials: Credentials) => null;
export const getSessionFromToken = async (token: JsonWebToken) => null;
export const signOutToken = async (token: JsonWebToken) => null;
