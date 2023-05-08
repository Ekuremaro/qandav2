using DbUp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using QandA;
using QandA.Authorization;
using QandA.Data;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
EnsureDatabase.For.SqlDatabase(connectionString);

var upgrader = DeployChanges.To
    .SqlDatabase(connectionString, null)
    .WithScriptsEmbeddedInAssembly(System.Reflection.Assembly.GetExecutingAssembly())
    .WithTransaction()
    .LogToConsole()
    .Build();


if (upgrader.IsUpgradeRequired())
{
    upgrader.PerformUpgrade();
}

builder.Services.AddScoped<IDataRepository, DataRepository>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IQuestionCache, QuestionCache>();

var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = domain;
    options.Audience = builder.Configuration["Auth0:Audience"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("read:messages", policy => policy.Requirements.Add(new
    HasScopeRequirement("read:messages", domain)));
});
builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
var myDomain = builder.Configuration["Domain"];
builder.Services.AddHttpClient("MyApi", client => client.BaseAddress = new Uri("https://dev-qw1ss4-u.us.auth0.com"));
builder.Services.AddAuthorization(options => options.AddPolicy("MustBeQuestionAuthor", policy => policy.Requirements.Add(new MustBeQuestionAuthorRequirement())));
builder.Services.AddScoped<IAuthorizationHandler, MustBeQuestionAuthorHandler>();

builder.Services.AddHttpContextAccessor();

var myOrigin = builder.Configuration["Frontend"];
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", builder => builder.AllowAnyMethod().AllowAnyHeader().WithOrigins(myOrigin)));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
