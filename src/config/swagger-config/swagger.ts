import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const buildSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle("Easygenerator API Documentation")
    .setDescription("The documentation about Easygenerator Api Documentation")
    .setVersion("1.0")
    .setContact("Gathsara Umesh", "Gathsaraumesh.com", "hello@gathsaraumesh.com")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  return SwaggerModule.createDocument(app, config);
};

export const setupSwagger = (app) => {
  const document = buildSwagger(app);
  SwaggerModule.setup("docs", app, document);
};
