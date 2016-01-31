# hipchat-to-es-pipe

A small utility to fetch all HipChat messages from a specified HipChat room and push into an ElasticSearch. 

## How to use

1. Run `npm init` to fetch all dependencies
2. (if you don't want to set env vars directly) Copy `.env.exmaple` to `.env` and enter your values
3. `npm start` 
4. All messages should appear in the specified index. 
5. Have phun and build nice graphs. 

## References

* [Building a Recipe Search Site with Angular and Elasticsearch](http://www.sitepoint.com/building-recipe-search-site-angular-elasticsearch/): Borrowed the part on Bulk-submitting entries into ES.
* [docker-elk](https://github.com/deviantony/docker-elk): Nice and easy ELK stack for local development
* [HipChat API Documentation](https://www.hipchat.com/docs/apiv2)

