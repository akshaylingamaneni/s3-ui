### 03/24/25

1. setup aws dashboard sidebar
2. setup aws creds modal and verification
3. setup scaffholds for s3 profile
4. todo: state and db setup for s3
5. todo: bucket lists and switch between public and private

### 03/25/25

1. Decided to go with upstash/redis its better suited here
2. added tanstack for query
3. having issues with supbase access key creation, created a support ticket
4. will go will public bucket for now, other should follow suit


### 03/28/25

## Ideas/challenges
1. Challenge is constant querying s3 for buckets will not be scalable
2. can have refresh button which which does a hard refresh if not store the buckets in redis, 
3. which means we need a caching strategy as we dont want to overwhelm the cache, for now i think 100 bucket names is good
    -  how are we going to sort they key when we insert? i.e on what property are we going to sort on
    - what is the eviction policy? i.e how are we going to evict,
        - attention driven? which means we track click? overkill for now
        - 
4. we have like 10k buckets per account 

### 03/29/25
## Approach
1. have a hard refresh to sync bucket names in redis
2. have a import step were we will poll all buckets for a account and store it in redis
3. [ ]todo: limit number of accounts possible to add if offering saas
4. categorize and group public and private buckets
5. clean up and simplify the flow
6. by saving all bucket names in redis can do alphabetically sorted bucket names
7. need to implement search and filter by letters
8. makes more sense to group buckets by alphabet when posting so all the buckets with start of letter belong to. can still have hot partitions if people use the same char but for now should be alright
