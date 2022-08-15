# Xenocrates
Wrapper for typesense for my custom search engine idea. Don't expect a lot for now. 
## What it has
* small integerated express http api for searching
* interfaces for items that go into indexing
* something so it can tell differences between urls
* normalizes urls so duplicate similar urls aren't added. 
* supports uris so it doesn't have to be a url. 
## WHAT IT DOESN'T
* **migrate collections on package update**. you have to delete database. If I make a change I'll provide a migration script most likely. 
* custom schemas are only partially supported, typescript will make it not trivial to insert them. Plan on adding a `addAny` method on the searcher. 