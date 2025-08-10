package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.HeatPump;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeatPumpRepository extends JpaRepository<HeatPump, Integer> {
}
