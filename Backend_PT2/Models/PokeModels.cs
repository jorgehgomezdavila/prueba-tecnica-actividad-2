using System.Text.Json.Serialization;

namespace Backend_PT2.Models;

public class PokemonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty; // Nosotros la generamos
}

// Respuesta de la API externa (Listado)
public class PokeApiResponse
{
    public int Count { get; set; }
    public string? Next { get; set; }
    public string? Previous { get; set; }
    public List<PokeResult> Results { get; set; } = new();
}

public class PokeResult
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

// Respuesta de la API externa (Detalle individual para búsqueda)
public class PokeDetailResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public PokeSprites Sprites { get; set; }
}

public class PokeSprites 
{
    [JsonPropertyName("front_default")]
    public string FrontDefault { get; set; }
    public PokeOther Other { get; set; }
}

public class PokeOther 
{
    [JsonPropertyName("official-artwork")]
    public PokeArtwork OfficialArtwork { get; set; }
}

public class PokeArtwork { [JsonPropertyName("front_default")] public string FrontDefault { get; set; } }

// BD Log
public class SearchLog
{
    public int Id { get; set; }
    public string? SearchTerm { get; set; }
    public int LimitParam { get; set; }
    public int OffsetParam { get; set; }
    public DateTime DateAccessed { get; set; }
}