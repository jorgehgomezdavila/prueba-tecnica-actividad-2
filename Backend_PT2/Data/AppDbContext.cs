using Microsoft.EntityFrameworkCore;
using Backend_PT2.Models;

namespace Backend_PT2.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<SearchLog> PokemonHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder mb) 
    {
        mb.Entity<SearchLog>().ToTable("PokemonSearchHistory");
    }
}