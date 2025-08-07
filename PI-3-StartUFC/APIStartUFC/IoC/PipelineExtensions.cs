using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Services;
using APIStartUFC.Infrastructure.Configuration;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Infrastructure.Repositories;
using APIStartUFC.Shared.Entities;

namespace APIStartUFC.WebApi.IoC
{
    public static class PipelineExtensions
    {
        public static void ConfigureInjection(this IServiceCollection serviceDescriptors)
        {
            serviceDescriptors.AddTransient<IDbContext, DbContext>();

            serviceDescriptors.AddScoped<IUserRepository, UserRepository>();
            serviceDescriptors.AddScoped<IUserService, UserService>();

            serviceDescriptors.AddScoped<INewsRepository, NewsRepository>();
            serviceDescriptors.AddScoped<INewsService, NewsService>();

            serviceDescriptors.AddScoped<ISupporterRepository, SupporterRepository>();
            serviceDescriptors.AddScoped<ISupporterService, SupporterService>();

            serviceDescriptors.AddScoped<IGalleryRepository, GalleryRepository>();
            serviceDescriptors.AddScoped<IGalleryService, GalleryService>();

            serviceDescriptors.AddScoped<IEventRepository, EventRepository>();
            serviceDescriptors.AddScoped<IEventService, EventService>();
            
            serviceDescriptors.AddScoped<IUserEventRepository, UserEventRepository>();

            serviceDescriptors.AddScoped<IImageRepository, ImageRepository>();

            serviceDescriptors.AddScoped<IAuthenticateService, AuthenticateService>();

            serviceDescriptors.AddScoped<IUnitOfWork, UnitOfWork>();
        }

        public static void ConfigureSettings(this IServiceCollection serviceDescriptors, IConfiguration configuration)
        {
            Settings settings = configuration.GetSection("Settings").Get<Settings>();

            serviceDescriptors.AddSingleton(options => settings);
        }
    }
}
