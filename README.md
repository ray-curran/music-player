# CityKey landing page

Edit `src/`, and then run:

    $ gulp build

Files will be put in `build/`.

Watch mode is available:

    $ gulp dev

To deploy to an AWS S3 bucket, run:

    $ gulp deploy

This will read your credentials from `~/.aws/credentials`. You should have received AWS keys, and you should add those to your `~/.aws/credentials` like this:

    [codegophers]
    aws_access_key_id = XXXXXXXXXXXXXX
    aws_secret_access_key = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
