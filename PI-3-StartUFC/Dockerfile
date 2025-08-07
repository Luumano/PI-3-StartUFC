# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY .. .
RUN dotnet restore APIStartUFC/APIStartUFC.WebApi.csproj
RUN dotnet publish APIStartUFC/APIStartUFC.WebApi.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
RUN mkdir -p /app/Images
EXPOSE 8080
ENTRYPOINT ["dotnet", "APIStartUFC.WebApi.dll"]