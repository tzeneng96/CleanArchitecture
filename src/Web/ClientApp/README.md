# Etiqa Architecture Demo #

## Technologies
* .NET 8.0
* Entity Framework Core 8.0
* Angular 17
* MediatR

## Getting Started

1. Rename the Project to kick start new project development
2. Ensure the following files are updated
- Solution
- Namespace

### Database Configuration

The template is configured to use an in-memory database by default. This ensures that all users will be able to run the solution without needing to set up additional infrastructure (e.g. SQL Server).

Verify that the **DefaultConnection** connection string within **appsettings.json** points to a valid SQL Server instance. 

When you run the application the database will be automatically created (if necessary) and the latest migrations will be applied.

### Database Migrations

To use `dotnet-ef` for your migrations please add the following flags to your command (values assume you are executing from repository root)

- `--project src/Infrastructure` (optional if in this folder)
- `--startup-project src/Web`
- `--output-dir Data/Migrations`

For example, to add a new migration from the root folder:

```
dotnet ef migrations add "SampleMigration" --project src\Infrastructure --startup-project src\Web --output-dir Data\Migrations
```
```
dotnet ef database update --project src/Infrastructure --startup-project src/Web
```
```
dotnet ef migrations remove --project src/Infrastructure --startup-project src/Web
```

For example, to remove last migrations:

```
dotnet ef database update LAST_KNOWN_MIGRATION --project src/Infrastructure --startup-project src/Web && dotnet ef migrations remove --project src/Infrastructure --startup-project src/Web
```

## Overview

### Domain

This will contain all entities, enums, exceptions, interfaces, types and logic specific to the domain layer.

### Application

This layer contains all application logic. It is dependent on the domain layer, but has no dependencies on any other layer or project. This layer defines interfaces that are implemented by outside layers. For example, if the application need to access a notification service, a new interface would be added to application and an implementation would be created within infrastructure.


### Infrastructure

This layer contains classes for accessing external resources such as file systems, web services, smtp, and so on. These classes should be based on interfaces defined within the application layer.

### Web

This layer is a single page application based on Angular 17 and ASP.NET Core 3.1. This layer depends on both the Application and Infrastructure layers, however, the dependency on Infrastructure is only to support dependency injection. Therefore only *Startup.cs* should reference Infrastructure.



