using System.Text.Json;
using Backend_PT2.Data;
using Backend_PT2.Models;

namespace Backend_PT2.Services;

public interface IPokeService
{
    Task<List<PokemonDto>> GetPokemons(int limit, int offset, string? type); 
    Task<PokemonDto?> GetPokemonByName(string name);
}

public class PokeService : IPokeService
{
    private readonly HttpClient _http;
    private readonly AppDbContext _db;

    public PokeService(HttpClient http, AppDbContext db)
    {
        _http = http;
        _db = db;
        _http.BaseAddress = new Uri("https://pokeapi.co/api/v2/");
    }

    public async Task<List<PokemonDto>> GetPokemons(int limit, int offset, string? type)
    {
        // Guardar Log
        _db.PokemonHistory.Add(new SearchLog 
        { 
            LimitParam = limit, OffsetParam = offset, SearchTerm = type ?? "ALL", DateAccessed = DateTime.Now 
        });
        await _db.SaveChangesAsync();

        List<PokeResult> rawResults = new();

        if (!string.IsNullOrEmpty(type))
        {
            
            var response = await _http.GetAsync($"type/{type.ToLower()}");
            if (!response.IsSuccessStatusCode) return new List<PokemonDto>();

            var content = await response.Content.ReadAsStringAsync();
            
            
            using (JsonDocument doc = JsonDocument.Parse(content))
            {
                
                var pokemonArray = doc.RootElement.GetProperty("pokemon");
                
                
                var allPokemonsOfType = pokemonArray.EnumerateArray()
                    .Select(x => new PokeResult 
                    { 
                        Name = x.GetProperty("pokemon").GetProperty("name").GetString() ?? "",
                        Url = x.GetProperty("pokemon").GetProperty("url").GetString() ?? ""
                    });

                // PAGINACIÓN EN MEMORIA (Backend Logic)
                rawResults = allPokemonsOfType.Skip(offset).Take(limit).ToList();
            }
        }
        else
        {
            var response = await _http.GetAsync($"pokemon?limit={limit}&offset={offset}");
            if (!response.IsSuccessStatusCode) return new List<PokemonDto>();
            
            var content = await response.Content.ReadAsStringAsync();
            var apiData = JsonSerializer.Deserialize<PokeApiResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (apiData != null) rawResults = apiData.Results;
        }

        // 3. Mapeo final a DTO con imagen
        return rawResults.Select(p => {
            var segments = p.Url.TrimEnd('/').Split('/');
            int.TryParse(segments.Last(), out int id);

            return new PokemonDto
            {
                Id = id,
                Name = p.Name,
                Url = p.Url,
                Image = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png"
            };
        }).ToList();
    }

    public async Task<PokemonDto?> GetPokemonByName(string name)
    {
        var response = await _http.GetAsync($"pokemon/{name.ToLower()}");
        if (!response.IsSuccessStatusCode) return null;

        var content = await response.Content.ReadAsStringAsync();
        var detail = JsonSerializer.Deserialize<PokeDetailResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (detail == null) return null;

        return new PokemonDto
        {
            Id = detail.Id,
            Name = detail.Name,
            Url = $"https://pokeapi.co/api/v2/pokemon/{detail.Id}",
            Image = detail.Sprites.Other.OfficialArtwork.FrontDefault ?? detail.Sprites.FrontDefault
        };
    }
}