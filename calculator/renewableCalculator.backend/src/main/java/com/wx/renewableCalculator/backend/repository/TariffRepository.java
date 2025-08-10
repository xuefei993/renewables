package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TariffRepository extends JpaRepository<Tariff, Integer> {
}
