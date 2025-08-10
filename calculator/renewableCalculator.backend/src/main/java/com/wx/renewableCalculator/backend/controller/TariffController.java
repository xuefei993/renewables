package com.wx.renewableCalculator.backend.controller;


import com.wx.renewableCalculator.backend.entity.Tariff;
import com.wx.renewableCalculator.backend.repository.TariffRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    private final TariffRepository tariffRepository;

    public TariffController(TariffRepository tariffRepository) {
        this.tariffRepository = tariffRepository;
    }

    @GetMapping
    public List<Tariff> getAllTariffs() {
        return tariffRepository.findAll();
    }

    @PostMapping
    public Tariff addTariff(@RequestBody Tariff tariff) {
        return tariffRepository.save(tariff);
    }
}
