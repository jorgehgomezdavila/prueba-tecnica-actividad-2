using Microsoft.AspNetCore.Mvc;
using Backend_PT2.Services;

namespace Backend_PT2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PokemonController : ControllerBase
{
    private readonly IPokeService _service;

    public PokemonController(IPokeService service)
    {
        _service = service;
    }

   [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int limit = 5,  
        [FromQuery] int offset = 0, 
        [FromQuery] string? name = null,
        [FromQuery] string? type = null) 
    {
        try
        {
            
            if (!string.IsNullOrWhiteSpace(name))
            {
                var pokemon = await _service.GetPokemonByName(name);
                if (pokemon == null) return NotFound("Pokemon not found.");
                return Ok(new List<object> { pokemon }); 
            }

           
            var list = await _service.GetPokemons(limit, offset, type);
            return Ok(list);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}