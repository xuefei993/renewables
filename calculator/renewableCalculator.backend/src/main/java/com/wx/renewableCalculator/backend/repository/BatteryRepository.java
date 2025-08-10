package com.wx.renewableCalculator.backend.repository;

import com.wx.renewableCalculator.backend.entity.Battery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatteryRepository extends JpaRepository<Battery, Integer> {

}
