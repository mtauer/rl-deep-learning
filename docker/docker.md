# Dockerized Version

This dockerfile runs the project scripts in a docker environment. Use this image to e.g. generate training data on one or more servers on a cloud service of your choice.

### Google Compute Engine

In order to use this docker container in GCP Compute Engine it needs to be deployed to the GCP Container Registry. To do this just run...

```
docker build --no-cache -t pandemic .
docker tag pandemic eu.gcr.io/<your project id>/pandemic
docker push eu.gcr.io/<your project id>/pandemic
```

For more information find the official documentation [here](https://cloud.google.com/container-registry/docs/pushing-and-pulling).
