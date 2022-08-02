// use shell command to save env variable to a temporary file, then return the contents.
// source: https://stackoverflow.com/questions/39444467/how-to-pass-environment-variable-to-mongo-script/60192758#60192758
function getEnvVariable(envVar) {
  var command = run('sh', '-c', `printenv ${envVar} >/tmp/${envVar}.txt`);
  // note: 'printenv --null' prevents adding line break to value
  return cat(`/tmp/${envVar}.txt`);
}
// create application user and collection
var dbRootUser = getEnvVariable('MONGO_INITDB_ROOT_USERNAME');
var dbRootPwd = getEnvVariable('MONGO_INITDB_ROOT_PASSWORD');
var dbUser = getEnvVariable('APP_USER');
var dbPwd = getEnvVariable('APP_PWD');
var dbName = getEnvVariable('DB_NAME');
var dbCollectionName = getEnvVariable('DB_COLLECTION_NAME');

//db.auth(dbRootUser, dbRootPwd);
//db = db.getSiblingDB(dbName);
//db = client.db(dbName);
db.createUser({
  user: 'app_user',
  pwd: 'app_userpwd',
  roles: [
    {
      role: 'dbOwner',
      db: 'raffleEntry',
    },
  ],
});

db = new Mongo().getDB('raffleEntry');

db.createCollection('entries');
db.entries.createIndex({ email: 1, method: 1 }, { unique: true });
