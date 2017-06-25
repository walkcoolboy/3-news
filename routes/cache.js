/**
* This file defines and implements caching policies
* It is used as routing middleware to prepare a response object
*/

/* For data that will change without warning, or sensitive data */
exports.setNone = function(req, res, next){

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
};

/* For static data that will likely never change */
exports.setFull = function(req, res, next){

  res.setHeader("Cache-Control", "public, max-age=31536000");
  next();
};

/* For responses that might change in the future
  This is set to 1 hour for private caches and 10 minutes for public caches
  This ensures public caches are as up-to-date as is practical
  */
exports.setShort = function(req, res, next){
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=600, proxy-revalidate");
  next();
};

/*
  For responses that are particular to a client, while not being sensitive
  An example for this would be a user's reccommendation page
*/
exports.setPrivate = function(req, res, next){

  res.setHeader("Cache-Control", "private, max-age=3600");
  next();
};
